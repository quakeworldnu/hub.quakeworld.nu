// KTX stats entries (api.quake.world/v1/servers/{address}/lastscores) => hub lastscores
import { parseQuakeText } from "./quakeText";

// lastscores are per host, keep the games played on the given server
export const toLastscores = (entries, address) => {
  const port = Number.parseInt(address.split(":")[1], 10);

  return entries
    .filter((e) => e.port === port && (e.players ?? []).length > 0)
    .map(toEntry);
};

const toEntry = (entry) => {
  const players = entry.players.map(toPlayer);
  const teams = "team" === entry.mode ? toTeams(players) : [];
  const participants = teams.length > 0 ? teams : players;

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
const demoMode = (demo = "") => {
  const index = demo.indexOf("_");
  return index === -1 ? "" : demo.substring(0, index);
};

// row for <Scoreboard />
const toPlayer = (player) => {
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

const toTeams = (players) => {
  const teamsByName = new Map();

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

const mostCommonColors = (players) => {
  const counts = new Map();

  for (const { colors } of players) {
    const key = colors.join(",");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const [key] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return key.split(",").map(Number);
};
