import { parseQuakeText } from "@qwhub/services/qworld/quakeText.ts";
import type { Server } from "@qwhub/services/qworld/types.ts";

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
