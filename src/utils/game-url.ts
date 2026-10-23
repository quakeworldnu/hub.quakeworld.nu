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

if (import.meta.vitest) {
  const { describe, expect, test } = import.meta.vitest;

  describe("parseUrlClips", () => {
    test("no params", () => {
      expect(parseUrlClips("")).toEqual([]);
      expect(parseUrlClips("?gameId=123")).toEqual([]);
    });

    test("multiple clips, in given order", () => {
      expect(
        parseUrlClips(
          "?gameId=123&clip=300-330:3&clip=60-90&clip=512-540:auto",
        ),
      ).toEqual([
        { from: 300, to: 330, track: 3 },
        { from: 60, to: 90, track: "auto" },
        { from: 512, to: 540, track: "auto" },
      ]);
    });

    test("skips invalid clips", () => {
      expect(
        parseUrlClips(
          "?clip=abc&clip=90-60&clip=60-60&clip=10-20:&clip=-5-10&clip=1-2",
        ),
      ).toEqual([{ from: 1, to: 2, track: "auto" }]);
    });

    test("track by player name", () => {
      expect(
        parseUrlClips(
          "?clip=80-105:bps&clip=330-355:wd%E2%80%A2char&clip=1-2:12",
        ),
      ).toEqual([
        { from: 80, to: 105, track: "bps" },
        { from: 330, to: 355, track: "wd•char" },
        { from: 1, to: 2, track: 12 },
      ]);
    });

    test("max 20 clips", () => {
      const search = Array.from({ length: 25 }, (_, i) => `clip=${i}-${i + 1}`);
      expect(parseUrlClips(`?${search.join("&")}`)).toHaveLength(20);
    });

    test("legacy params take precedence", () => {
      expect(parseUrlClips("?from=60&to=90&clip=300-330")).toEqual([]);
      expect(parseUrlClips("?track=3&clip=300-330")).toEqual([]);
      expect(parseUrlClips("?to=90&clip=300-330")).toEqual([]);
    });
  });
}
