// KTX stats entries (api.quake.world/v1/servers/{address}/lastscores) => hub lastscores
import { parseQuakeText } from "./quake-text";

// api entry (subset of ktx stats)
type KtxStatsPlayer = {
  name?: string;
  team?: string;
  "top-color"?: number;
  "bottom-color"?: number;
  stats?: { frags?: number };
  ping?: number;
  bot?: unknown;
};

export type KtxStatsEntry = {
  port: number;
  date?: string;
  mode: string;
  map: string;
  demo?: string;
  players?: KtxStatsPlayer[];
};

export type LastscoresPlayer = {
  name: string;
  name_color: string;
  team: string;
  team_color: string;
  colors: number[];
  frags: number;
  ping: number;
  is_bot: boolean;
};

export type LastscoresTeam = {
  name: string;
  name_color: string;
  frags: number;
  ping: number;
  colors: number[];
};

export type Lastscores = {
  timestamp: string;
  mode: string;
  map: string;
  demo: string | undefined;
  participants: string;
  scores: string;
  players: LastscoresPlayer[];
  teams: LastscoresTeam[];
};

// lastscores are per host, keep the games played on the given server
export const toLastscores = (
  entries: KtxStatsEntry[],
  address: string,
): Lastscores[] => {
  const port = Number.parseInt(address.split(":")[1], 10);

  return entries
    .filter((e) => e.port === port && (e.players ?? []).length > 0)
    .map(toEntry);
};

const toEntry = (entry: KtxStatsEntry): Lastscores => {
  // entries without players are filtered out above
  const players = (entry.players ?? []).map(toPlayer);
  const teams = "team" === entry.mode ? toTeams(players) : [];
  const participants: { name: string; frags: number }[] =
    teams.length > 0 ? teams : players;

  return {
    timestamp: (entry.date ?? "").substring(0, "YYYY-MM-DD HH:MM".length),
    mode: demoMode(entry.demo) || entry.mode,
    map: entry.map,
    demo: entry.demo,
    participants: participants.map((p) => p.name).join(" vs "),
    scores: participants.map((p) => p.frags).join(":"),
    players,
    teams,
  };
};

// "4on4_red_vs_blue[dm3]20261019-1608.mvd" => "4on4"
const demoMode = (demo = ""): string => {
  const index = demo.indexOf("_");
  return index === -1 ? "" : demo.substring(0, index);
};

// row for <Scoreboard />
const toPlayer = (player: KtxStatsPlayer): LastscoresPlayer => {
  const name = parseQuakeText(player.name ?? "");
  const team = parseQuakeText(player.team ?? "");

  return {
    name: name.text,
    name_color: name.colors,
    team: team.text,
    team_color: team.colors,
    colors: [player["top-color"] ?? 0, player["bottom-color"] ?? 0],
    frags: player.stats?.frags ?? 0,
    ping: player.ping ?? 0,
    is_bot: "bot" in player,
  };
};

const toTeams = (players: LastscoresPlayer[]): LastscoresTeam[] => {
  const teamsByName = new Map<string, LastscoresPlayer[]>();

  for (const player of players) {
    teamsByName.set(player.team, [
      ...(teamsByName.get(player.team) ?? []),
      player,
    ]);
  }

  const teams = [...teamsByName.values()].map((teamPlayers) => {
    const humans = teamPlayers.filter((p) => !p.is_bot);
    const totalPing = humans.reduce((sum, p) => sum + p.ping, 0);

    return {
      name: teamPlayers[0].team,
      name_color: teamPlayers[0].team_color,
      frags: teamPlayers.reduce((sum, p) => sum + p.frags, 0),
      ping: humans.length > 0 ? Math.round(totalPing / humans.length) : 0,
      colors: mostCommonColors(teamPlayers),
    };
  });
  teams.sort((a, b) => b.frags - a.frags);
  return teams;
};

const mostCommonColors = (players: LastscoresPlayer[]): number[] => {
  const counts = new Map<string, number>();

  for (const { colors } of players) {
    const key = colors.join(",");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const [key] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return key.split(",").map(Number);
};
