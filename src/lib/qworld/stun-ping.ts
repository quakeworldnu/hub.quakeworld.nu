import { useEffect, useSyncExternalStore } from "react";
import { useMediaQuery } from "usehooks-ts";
import { localStorageGet, localStorageSet } from "@/lib/local-storage";
import { stunHosts } from "./stun-hosts";
import type { Server } from "./types";

// browser => server round trip time using STUN (mvdsv answers STUN binding requests
// on the game port since https://github.com/QW-Group/mvdsv/pull/241, fte natively).
// browsers can't send raw udp, so the server is used as an ice server and the time
// until the server reflexive candidate arrives is measured (no qw connection is made).
// one attempt per ip, servers on the same ip have about the same ping.
// results are stored in local storage for 6 hours.

const TIMEOUT_MS = 1500;
const CONCURRENCY = 4;

// fte answers stun natively (ice support), detected by version
export const isFte = (server: Server): boolean =>
  (server.info["*version"] ?? "").startsWith("FTE");

// stun port of a server expected to answer stun: fte servers, or mvdsv hosts in the
// hardcoded list, matched on hostname (stays valid if the ip changes) or ip
export function stunPort(server: Server): number | undefined {
  if (isFte(server)) {
    return server.port;
  }

  const hostname = server.meta.hostport.split(":")[0].toLowerCase();
  return stunHosts.get(hostname) ?? stunHosts.get(server.ip);
}

export const supportsStun = (server: Server): boolean =>
  undefined !== stunPort(server);

export async function measureStunRtt(
  ip: string,
  port: number,
  timeoutMs = TIMEOUT_MS,
): Promise<number | null> {
  if (typeof RTCPeerConnection === "undefined") {
    return null;
  }

  let pc: RTCPeerConnection | undefined;

  try {
    pc = new RTCPeerConnection({
      iceServers: [{ urls: `stun:${ip}:${port}` }],
    });
    pc.createDataChannel("ping");
    const offer = await pc.createOffer();
    const peer = pc;

    return await new Promise<number | null>((resolve) => {
      const timeout = setTimeout(() => resolve(null), timeoutMs);
      let start = 0;

      peer.onicecandidate = (e) => {
        if (!e.candidate) {
          clearTimeout(timeout);
          resolve(null); // gathering complete without a reply
        } else if (e.candidate.candidate.includes(" typ srflx")) {
          clearTimeout(timeout);
          resolve(Math.round(performance.now() - start));
        }
      };

      // ice gathering (and the stun request) starts here
      start = performance.now();
      peer.setLocalDescription(offer).catch(() => resolve(null));
    });
  } catch {
    return null;
  } finally {
    pc?.close();
  }
}

// ip => rtt (ms), null = no reply, missing = not measured (yet)
type PingResult =
  | { status: "pending" }
  | { status: "done"; rtt: number | null };

// measured pings are kept in local storage for 6 hours (no reply included)
const STORAGE_KEY = "stunPings";
const MAX_AGE_MS = 6 * 60 * 60 * 1000;
type StoredPings = Record<string, { rtt: number | null; at: number }>;

function loadStoredPings(now = Date.now()): StoredPings {
  try {
    const stored = localStorageGet<StoredPings>(STORAGE_KEY, {});
    return Object.fromEntries(
      Object.entries(stored).filter(([, p]) => now - p.at < MAX_AGE_MS),
    );
  } catch {
    return {}; // unavailable or invalid
  }
}

function storePing(ip: string, rtt: number | null) {
  try {
    localStorageSet(STORAGE_KEY, {
      ...loadStoredPings(),
      [ip]: { rtt, at: Date.now() },
    });
  } catch {
    // unavailable (e.g. private mode) or full, keep in memory only
  }
}

const results = new Map<string, PingResult>(
  Object.entries(loadStoredPings()).map(([ip, p]) => [
    ip,
    { status: "done", rtt: p.rtt },
  ]),
);
const queue: { ip: string; port: number }[] = [];
const listeners = new Set<() => void>();
let version = 0;
let running = 0;

function notify() {
  version++;
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function runQueue() {
  while (running < CONCURRENCY && queue.length > 0) {
    const next = queue.shift();

    if (!next) {
      return;
    }

    running++;
    measureStunRtt(next.ip, next.port).then((rtt) => {
      running--;
      results.set(next.ip, { status: "done", rtt });
      storePing(next.ip, rtt);
      notify();
      runQueue();
    });
  }
}

// queue one ping per (not yet pinged) ip
export function requestStunPings(servers: Server[]) {
  let hasNew = false;

  for (const server of servers) {
    if (!results.has(server.ip) && supportsStun(server)) {
      results.set(server.ip, { status: "pending" });
      // the port known to answer (not every server on the ip supports stun),
      // pinged by ip: resolving a hostname would add dns lookup time to the rtt
      queue.push({ ip: server.ip, port: stunPort(server) ?? server.port });
      hasNew = true;
    }
  }

  if (hasNew) {
    notify();
    runQueue();
  }
}

export function getStunPing(ip: string): PingResult | undefined {
  return results.get(ip);
}

// measured ping for an ip: rtt in ms, null = no reply/unsupported/pending
export function useStunPing(ip: string): number | null {
  return useSyncExternalStore(subscribe, () => {
    const result = results.get(ip);
    return result?.status === "done" ? result.rtt : null;
  });
}

// no pinging on mobile (ping column is hidden), same breakpoint as tailwind "md"
const PING_MEDIA_QUERY = "(min-width: 768px)";

// pings the given servers (once per ip), returns a version that changes on new results.
// nothing is measured unless enabled (opt-in: webrtc can expose local interface addresses)
export function useStunPings(servers: Server[], isEnabled: boolean): number {
  const isDesktop = useMediaQuery(PING_MEDIA_QUERY);

  useEffect(() => {
    if (isEnabled && isDesktop) {
      requestStunPings(servers);
    }
  }, [servers, isEnabled, isDesktop]);

  return useSyncExternalStore(subscribe, () => version);
}

if (import.meta.vitest) {
  const { expect, test } = import.meta.vitest;
  test("stunPort", () => {
    const server = (ip: string, hostport: string, version = "MVDSV 1.20-dev") =>
      ({
        ip,
        port: 27500,
        info: { "*version": version },
        meta: { hostport },
      }) as unknown as Server;
    // by hostname, also when the ip changed
    expect(stunPort(server("1.2.3.4", "qw.0f.se:28502"))).toBe(28501);
    expect(stunPort(server("1.2.3.4", "QW.0F.SE:28502"))).toBe(28501);
    // by ip (no hostname)
    expect(stunPort(server("144.6.14.154", "144.6.14.154:28501"))).toBe(28501);
    expect(supportsStun(server("127.0.0.1", "127.0.0.1:27500"))).toBe(false);
    // fte: any server, own port
    const fte = server(
      "127.0.0.1",
      "127.0.0.1:27500",
      "FTE git-6729-f937b9d88",
    );
    expect(stunPort(fte)).toBe(27500);
  });
}
