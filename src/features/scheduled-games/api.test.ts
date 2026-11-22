import { describe, expect, it } from "vitest";
import {
  mergeScheduledGames,
  type ScheduledGame,
} from "@/features/scheduled-games/api";

const at = Date.parse("2026-11-22T21:00:00Z");

const game = (
  source: ScheduledGame["source"],
  a: [string, string],
  b: [string, string],
  scheduledAt = at,
): ScheduledGame => ({
  id: `${source}-${a[1]}-${b[1]}-${scheduledAt}`,
  source,
  teamA: { name: a[0], tag: a[1] },
  teamB: { name: b[0], tag: b[1] },
  gameType: "official",
  scheduledAt,
  url: "",
});

describe("mergeScheduledGames", () => {
  it("prefers qwleague when both sources have the same game", () => {
    const scheduler = [
      game("scheduler", ["Slackers", "]SR["], ["Black book", "Book"]),
    ];
    const qwleague = [
      game("qwleague", ["Black Book", "Book"], ["Slackers", "]sr["]),
    ];

    expect(mergeScheduledGames(scheduler, qwleague)).toEqual(qwleague);
  });

  it("keeps games that differ in time or teams", () => {
    const scheduler = [
      game(
        "scheduler",
        ["Slackers", "]SR["],
        ["Black book", "Book"],
        at + 3600_000,
      ),
      game("scheduler", ["Slackers", "]SR["], ["Hell Xpress", "[hx]"]),
    ];
    const qwleague = [
      game("qwleague", ["Black Book", "Book"], ["Slackers", "]sr["]),
    ];

    expect(
      mergeScheduledGames(scheduler, qwleague).map((g) => g.source),
    ).toEqual(["qwleague", "scheduler", "scheduler"]);
  });

  it("sorts by time and limits to 10 games", () => {
    const qwleague = Array.from({ length: 12 }, (_, i) =>
      game("qwleague", ["a", `a${i}`], ["b", `b${i}`], at - i),
    );
    const merged = mergeScheduledGames([], qwleague);

    expect(merged).toHaveLength(10);
    expect(merged[0].scheduledAt).toBe(at - 11);
  });
});
