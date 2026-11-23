import { describe, expect, it } from "vitest";
import {
  fromQwleagueItems,
  mergeScheduledGames,
  type QwleagueItem,
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

    expect(mergeScheduledGames(scheduler, qwleague).map((g) => g.id)).toEqual(
      qwleague.map((g) => g.id),
    );
  });

  it("borrows tags and logos from the scheduler for the same game", () => {
    const scheduler = [
      game("scheduler", ["Slackers", "]SR["], ["Hell Xpress", "[hx]"]),
    ];
    scheduler[0].teamA.logoUrl = "sr.png";
    scheduler[0].teamB.logoUrl = "hx.png";

    const qwleague = [
      game(
        "qwleague",
        ["Hell Xpress", "Hell Xpress"],
        ["Slackers", "Slackers"],
      ),
      game("qwleague", ["ving", "ving"], ["Slackers", "Slackers"], at + 1),
    ];

    const [first, second] = mergeScheduledGames(scheduler, qwleague);

    expect(first.source).toBe("qwleague");
    expect(first.teamA).toMatchObject({
      name: "Hell Xpress",
      tag: "[hx]",
      logoUrl: "hx.png",
    });
    expect(first.teamB).toMatchObject({
      name: "Slackers",
      tag: "]SR[",
      logoUrl: "sr.png",
    });
    expect(second).toEqual(qwleague[1]);
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

describe("fromQwleagueItems", () => {
  const item = (overrides: Partial<QwleagueItem> = {}): QwleagueItem => ({
    type: "official",
    scheduled_at: 1795464000,
    status: "upcoming",
    side1: { clan: { name: "Black Book" }, player: null },
    side2: { clan: { name: "Suddendeath" }, player: null },
    ...overrides,
  });

  it("maps upcoming games", () => {
    expect(fromQwleagueItems([item(), item({ status: "live" })])).toEqual([
      {
        id: "qwleague-official-1795464000-Black Book-Suddendeath",
        source: "qwleague",
        teamA: { name: "Black Book", tag: "Black Book" },
        teamB: { name: "Suddendeath", tag: "Suddendeath" },
        gameType: "official",
        scheduledAt: 1795464000_000,
        url: "https://qwleague.com",
      },
    ]);
  });

  it("uses clan ids, tags and tournament slugs when available", () => {
    const [game] = fromQwleagueItems([
      item({
        tournament: { name: "4on4 · Season 1", slug: "4on4-season-1" },
        side1: {
          clan: { id: 1, name: "Black Book", team: "Book" },
          player: null,
        },
        side2: {
          clan: {
            id: 3,
            name: "Suddendeath",
            team: "",
            emblem_updated_at: 1785782799,
          },
          player: null,
        },
      }),
    ]);

    expect(game.url).toBe("https://qwleague.com/tournaments/4on4-season-1");
    expect(game.teamA).toMatchObject({ name: "Black Book", tag: "Book" });
    expect(game.teamA.logoUrl).toBeUndefined();
    expect(game.teamB).toMatchObject({
      name: "Suddendeath",
      tag: "Suddendeath",
      logoUrl: "https://qwleague.com/api/clans/3/emblem?v=1785782799",
    });
  });

  it("handles practice games and missing sides", () => {
    const [game] = fromQwleagueItems([
      item({
        type: "prac",
        side1: { clan: null, player: { username: "milton" } },
        side2: null,
      }),
    ]);

    expect(game.gameType).toBe("practice");
    expect(game.teamA.name).toBe("milton");
    expect(game.teamB.name).toBe("TBD");
  });
});
