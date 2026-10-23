import { parseQuakeText } from "./quake-text";
import type { Server } from "./types";

export function qtvClientCount(server: Server): number {
  return server.qtv_stream?.client_names.length ?? 0;
}

export function totalSpectatorCount(server: Server): number {
  return server.spectators.length + qtvClientCount(server);
}

export function freePlayerSlots(server: Server): number {
  return server.player_limit - server.players.length;
}

export function freeSpectatorSlots(server: Server): number {
  const limit =
    server.spectator_limit ??
    Number.parseInt(server.info.maxspectators ?? "0", 10);
  return limit - server.spectators.length;
}

// "Standby - Waiting for players", status name omitted when unknown
export function statusText(server: Server): string {
  const { name, description } = server.meta.status;
  return ["Unknown" === name ? "" : name, description]
    .filter(Boolean)
    .join(" - ");
}

export function hasClient(server: Server, name: string): boolean {
  const needle = name.toLowerCase();
  const clientNames = [
    ...server.players.map((p) => p.name),
    ...server.spectators.map((s) => s.name),
    ...(server.qtv_stream?.client_names ?? []),
  ];
  return clientNames.some((n) => n.ascii.toLowerCase() === needle);
}

// rows for <Scoreboard />
export function scoreboardPlayers(server: Server) {
  return server.players.map((p) => {
    const name = parseQuakeText(p.name.unicode);
    const team = parseQuakeText(p.team.unicode);

    return {
      id: p.user_id,
      name: name.text,
      name_color: name.colors,
      team: team.text,
      team_color: team.colors,
      colors: [p.top_color, p.bottom_color],
      frags: p.frags,
      ping: p.ping,
      is_bot: Boolean(p.bot),
    };
  });
}

export function scoreboardTeams(server: Server) {
  if (Number.parseInt(server.info.teamplay ?? "0", 10) <= 0) {
    return [];
  }

  return server.teams.map((t) => {
    const name = parseQuakeText(t.name.unicode);

    return {
      name: name.text,
      name_color: name.colors,
      colors: [t.top_color, t.bottom_color],
      frags: t.frags,
      ping: t.ping,
    };
  });
}

export function qwleagueCountryCode(hostname = ""): string {
  const match = (hostname ?? "").match(/(?:^|\.)([a-z]{2})\.qwleague\.com/i);
  return match ? match[1].toLowerCase() : "";
}

export function isQwleagueHostname(hostname: string | null = ""): boolean {
  return (hostname ?? "").includes(".qwleague.com");
}

export function isQwleagueOfficial(
  hostname: string | null = "",
  matchtag: string | null = "",
): boolean {
  return (
    isQwleagueHostname(hostname) &&
    (matchtag ?? "").toLowerCase().includes("official")
  );
}

if (import.meta.vitest) {
  const { describe, expect, test } = import.meta.vitest;
  const name = (ascii: string) => ({ ascii });
  // partial server: only the fields read by the functions under test
  const server = {
    player_limit: 8,
    spectator_limit: null,
    info: { maxspectators: "4", teamplay: "2" },
    meta: { status: { name: "Standby", description: "Waiting for players" } },
    players: [{ name: name("Milton") }, { name: name("bps") }],
    spectators: [{ name: name("[ServeMe]") }],
    qtv_stream: { client_names: [name("vikpe")] },
  } as unknown as Server;

  test("slots and spectators", () => {
    expect(freePlayerSlots(server)).toBe(6);
    expect(freeSpectatorSlots(server)).toBe(3);
    expect(qtvClientCount(server)).toBe(1);
    expect(totalSpectatorCount(server)).toBe(2);
  });

  test("statusText", () => {
    expect(statusText(server)).toBe("Standby - Waiting for players");
    const unknown = {
      meta: { status: { name: "Unknown", description: "No players" } },
    } as unknown as Server;
    expect(statusText(unknown)).toBe("No players");
  });

  test("hasClient", () => {
    expect(hasClient(server, "MILTON")).toBe(true);
    expect(hasClient(server, "vikpe")).toBe(true);
    expect(hasClient(server, "xantom")).toBe(false);
  });

  describe("qwleague", () => {
    test("qwleagueCountryCode", () => {
      expect(qwleagueCountryCode("de.qwleague.com:28501")).toBe("de");
      expect(qwleagueCountryCode("SE.qwleague.com")).toBe("se");
      expect(qwleagueCountryCode("quake.se:28501")).toBe("");
    });

    test("isQwleagueOfficial", () => {
      expect(isQwleagueOfficial("de.qwleague.com", "Official")).toBe(true);
      expect(isQwleagueOfficial("de.qwleague.com", "prac")).toBe(false);
      expect(isQwleagueOfficial("quake.se", "official")).toBe(false);
      expect(isQwleagueOfficial(null, null)).toBe(false);
    });
  });
}
