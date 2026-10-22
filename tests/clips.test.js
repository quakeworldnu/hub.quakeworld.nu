import { describe, expect, test } from "vitest";

import { parseUrlClips } from "../src/pages/games/hooks";

describe("parseUrlClips", () => {
  test("no params", () => {
    expect(parseUrlClips("")).toEqual([]);
    expect(parseUrlClips("?gameId=123")).toEqual([]);
  });

  test("multiple clips, in given order", () => {
    expect(
      parseUrlClips("?gameId=123&clip=300-330:3&clip=60-90&clip=512-540:auto"),
    ).toEqual([
      { from: 300, to: 330, track: 3 },
      { from: 60, to: 90, track: "auto" },
      { from: 512, to: 540, track: "auto" },
    ]);
  });

  test("skips invalid clips", () => {
    expect(
      parseUrlClips(
        "?clip=abc&clip=90-60&clip=60-60&clip=10-20:foo&clip=-5-10&clip=1-2",
      ),
    ).toEqual([{ from: 1, to: 2, track: "auto" }]);
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
