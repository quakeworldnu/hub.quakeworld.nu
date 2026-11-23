import { describe, expect, it } from "vitest";
import {
  fromQwleagueItems,
  fromSchedulerTeamDocs,
  mergeScheduledGames,
  type QwleagueItem,
  type ScheduledGame,
  slugify,
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
    expect(second.teamA).toEqual(qwleague[1].teamA);
    expect(second.teamB).toMatchObject({ tag: "]SR[", logoUrl: "sr.png" });
  });

  it("borrows tags and logos from the scheduler teams", () => {
    const qwleague = [
      game("qwleague", ["Black Book", "Black Book"], ["ving", "ving"]),
    ];
    const teams = [
      { name: "Black book", tag: "Book", logoUrl: "book.png" },
      { name: "Ving", tag: "ving", logoUrl: "ving.png" },
    ];

    const [merged] = mergeScheduledGames([], qwleague, teams);

    expect(merged.teamA).toMatchObject({
      name: "Black Book",
      tag: "Book",
      logoUrl: "book.png",
    });
    expect(merged.teamB).toMatchObject({
      name: "ving",
      tag: "ving",
      logoUrl: "ving.png",
    });
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

  it("uses clan ids and tags when available", () => {
    const [game] = fromQwleagueItems([
      item({
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

    expect(game.teamA).toMatchObject({ name: "Black Book", tag: "Book" });
    expect(game.teamA.logoUrl).toBeUndefined();
    expect(game.teamB).toMatchObject({
      name: "Suddendeath",
      tag: "Suddendeath",
      logoUrl: "https://qwleague.com/api/clans/3/emblem?v=1785782799",
    });
  });

  it("derives the tournament url from its name", () => {
    const [game] = fromQwleagueItems([
      item({ tournament: { name: "4on4 · Season 1" } }),
    ]);

    expect(game.url).toBe("https://qwleague.com/tournaments/4on4-season-1");
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

describe("fromSchedulerTeamDocs", () => {
  const doc = (name: string, tag: string, status: string, logo?: string) => ({
    fields: {
      teamName: { stringValue: name },
      teamTag: { stringValue: tag },
      status: { stringValue: status },
      ...(logo && {
        activeLogo: {
          mapValue: {
            fields: {
              urls: {
                mapValue: { fields: { medium: { stringValue: logo } } },
              },
            },
          },
        },
      }),
    },
  });

  it("maps teams, active first", () => {
    expect(
      fromSchedulerTeamDocs([
        doc("Slackers", "old", "archived"),
        doc("Slackers", "]SR[", "active", "sr.png"),
        {},
      ]),
    ).toEqual([
      { name: "Slackers", tag: "]SR[", logoUrl: "sr.png" },
      { name: "Slackers", tag: "old", logoUrl: undefined },
    ]);
  });
});

describe("slugify", () => {
  it("slugifies tournament names", () => {
    expect(slugify("4on4 · Season 1")).toBe("4on4-season-1");
    expect(slugify("  Ünder · 2on2 Cup! ")).toBe("under-2on2-cup");
  });
});
