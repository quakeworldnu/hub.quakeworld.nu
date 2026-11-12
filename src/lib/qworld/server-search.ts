import Fuse, { type IFuseOptions } from "fuse.js";
import type { Server } from "./types";

// freetext search on hostname or client name (player, spectator or qtv spectator)
const fuseOptions: IFuseOptions<Server> = {
  threshold: 0.3,
  ignoreLocation: true,
  keys: [
    {
      name: "hostname",
      getFn: (s) => [s.info.hostname ?? "", s.meta.addressTitle],
    },
    {
      name: "clients",
      getFn: (s) => [
        ...s.players.map((p) => p.name.ascii),
        ...s.spectators.map((p) => p.name.ascii),
        ...(s.qtv_stream?.client_names ?? []).map((n) => n.ascii),
      ],
    },
  ],
};

// keeps the original server order
export function searchServers(servers: Server[], query: string): Server[] {
  const q = query.trim();

  if (0 === q.length || 0 === servers.length) {
    return servers;
  }

  const fuse = new Fuse(servers, fuseOptions);
  const matches = new Set(fuse.search(q).map((r) => r.item));
  return servers.filter((s) => matches.has(s));
}

if (import.meta.vitest) {
  const { expect, test } = import.meta.vitest;
  const qs = (ascii: string) => ({ ascii, unicode: ascii });
  const server = (
    hostname: string,
    players: string[],
    spectators: string[] = [],
  ) =>
    ({
      info: { hostname },
      meta: { addressTitle: hostname },
      players: players.map((n) => ({ name: qs(n) })),
      spectators: spectators.map((n) => ({ name: qs(n) })),
      qtv_stream: null,
    }) as unknown as Server;

  const foppa = server("qw.foppa.dk:28501", ["XantoM", "bps"]);
  const qwlan = server("play.qwlan.pl:28502", ["Milton"], ["andeh"]);
  const servers = [foppa, qwlan];

  test("searchServers", () => {
    expect(searchServers(servers, "")).toEqual(servers);
    expect(searchServers(servers, "  ")).toEqual(servers);
    expect(searchServers(servers, "qwlan")).toEqual([qwlan]);
    expect(searchServers(servers, "xantom")).toEqual([foppa]);
    expect(searchServers(servers, "milto")).toEqual([qwlan]);
    expect(searchServers(servers, "andeh")).toEqual([qwlan]);
    expect(searchServers(servers, "zzzzzz")).toEqual([]);
  });
}
