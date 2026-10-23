import { useEffect, useRef, useState } from "react";
import {
  useEventListener as uhUseEventListener,
  useCounter,
  useInterval,
} from "usehooks-ts";

export function useUpdateInterval(delay: number | null) {
  const { count, increment } = useCounter(0);
  useInterval(increment, delay);
  return count;
}

// same as useThrottle from @uidotdev/usehooks
export function useThrottle<T>(value: T, interval = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now();

    if (lastUpdated.current && now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const id = window.setTimeout(() => {
        lastUpdated.current = now;
        setThrottledValue(value);
      }, interval);

      return () => window.clearTimeout(id);
    }
  }, [value, interval]);

  return throttledValue;
}

export function useEventListener(
  eventName: string,
  handler: (event: any) => void,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  uhUseEventListener(eventName, handler);
}

export function useVisibilityChange(
  onChange: (state: DocumentVisibilityState) => void,
) {
  useEffect(() => {
    // same function reference for add/remove, otherwise the listener is never removed
    const handleChange = () => onChange(document.visibilityState);
    document.addEventListener("visibilitychange", handleChange);
    return () => {
      document.removeEventListener("visibilitychange", handleChange);
    };
  }, []);
}

// idle after `timeout` ms without mouse movement over the element (or document)
export function useMouseIdle({
  elementId,
  timeout,
  onIdle,
  onActive,
}: {
  elementId: string;
  timeout: number;
  onIdle: () => void;
  onActive: () => void;
}) {
  const callbacks = useRef({ onIdle, onActive });
  callbacks.current = { onIdle, onActive };

  useEffect(() => {
    const target = document.getElementById(elementId) ?? document;
    const throttleMs = 200;
    let isIdle = false;
    let lastMoveAt = 0;
    let timer = window.setTimeout(setIdle, timeout);

    function setIdle() {
      isIdle = true;
      callbacks.current.onIdle();
    }

    function handleMove() {
      const now = Date.now();

      if (now - lastMoveAt < throttleMs) {
        return;
      }
      lastMoveAt = now;

      if (isIdle) {
        isIdle = false;
        callbacks.current.onActive();
      }

      window.clearTimeout(timer);
      timer = window.setTimeout(setIdle, timeout);
    }

    target.addEventListener("mousemove", handleMove);
    return () => {
      window.clearTimeout(timer);
      target.removeEventListener("mousemove", handleMove);
    };
  }, [elementId, timeout]);
}

export function useWakeLock() {
  useEffect(() => {
    async function requestWakeLock() {
      try {
        await navigator.wakeLock.request("screen");
      } catch {}
    }

    requestWakeLock();
  }, []);
}

export function useCurrentGameId(): number | undefined {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get("gameId");

  if (gameId) {
    return Number.parseInt(gameId, 10);
  }

  // legacy fallback
  const demoId = params.get("demoId");
  return demoId ? Number.parseInt(demoId, 10) : undefined;
}

export function useUrlClipParams(): {
  from: number;
  to: number;
  track: number | string;
  hasParams: boolean;
} {
  const params = new URLSearchParams(window.location.search);
  const from = Number.parseInt(params.get("from") || "0", 10);
  const to = Number.parseInt(params.get("to") || "0", 10);
  const track = params.get("track") || "auto";
  const hasParams = params.has("from") || params.has("track");
  return { from, to, track, hasParams };
}

// multiple clips, e.g. ?clip=60-90:3&clip=300-330:bps&clip=400-420
// (from-to[:track] in demo seconds, track is userid, player name or auto)
// extends the legacy from/to/track params, which take precedence if present
export type Clip = {
  from: number;
  to: number;
  track: number | string; // userid, player name or "auto"
};

const MAX_CLIPS = 20;
const CLIP_RE = /^(\d+)-(\d+)(?::(.+))?$/;

export function parseUrlClips(search: string): Clip[] {
  const params = new URLSearchParams(search);
  const hasLegacyParams = ["from", "to", "track"].some((k) => params.has(k));

  if (hasLegacyParams) {
    return [];
  }

  const clips: Clip[] = [];

  for (const value of params.getAll("clip")) {
    const match = value.match(CLIP_RE);

    if (!match) {
      continue;
    }

    const from = Number.parseInt(match[1], 10);
    const to = Number.parseInt(match[2], 10);
    const track = parseClipTrack(match[3]);

    if (from < to) {
      clips.push({ from, to, track });
    }
  }

  return clips.slice(0, MAX_CLIPS);
}

function parseClipTrack(value: string | undefined): number | string {
  if (!value) {
    return "auto";
  }

  return /^\d+$/.test(value) ? Number(value) : value;
}
