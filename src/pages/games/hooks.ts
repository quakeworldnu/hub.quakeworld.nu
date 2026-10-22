import { useEffect } from "react";
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

// export function useDebouncedElementSize(delay: number = 200) {
//   const [ref, size_] = useElementSize();
//   const size = useDebounce(size_, delay);
//   return [ref, size];
// }

export function useEventListener(
  eventName: string,
  handler: (event: any) => void,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  uhUseEventListener(eventName, handler);
}

export function useVisibilityChange(
  onChange: (state: DocumentVisibilityState) => void,
) {
  useEffect(() => {
    document.addEventListener("visibilitychange", () =>
      onChange(document.visibilityState),
    );
    return () => {
      document.removeEventListener("visibilitychange", () =>
        onChange(document.visibilityState),
      );
    };
  }, []);
}

export function useWakeLock() {
  useEffect(() => {
    async function requestWakeLock() {
      try {
        await navigator.wakeLock.request("screen");
      } catch (err) {}
    }

    requestWakeLock();
  }, []);
}

export function useCurrentGameId(): number | undefined {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get("gameId");

  if (gameId) {
    return Number.parseInt(gameId);
  }

  // legacy fallback
  const demoId = params.get("demoId");
  return demoId ? Number.parseInt(demoId) : undefined;
}

export function useUrlClipParams(): {
  from: number;
  to: number;
  track: number | string;
  hasParams: boolean;
} {
  const params = new URLSearchParams(window.location.search);
  const from = Number.parseInt(params.get("from") || "0");
  const to = Number.parseInt(params.get("to") || "0");
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

    const from = Number.parseInt(match[1]);
    const to = Number.parseInt(match[2]);
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

export function useUrlClips(): Clip[] {
  return parseUrlClips(window.location.search);
}
