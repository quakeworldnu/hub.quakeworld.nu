import { quakeTextToHtml } from "@/components/ui/quake-text";
import { parseQuakeText } from "@/lib/qworld/quake-text";

export const SCHEDULER_URL = "https://scheduler.quake.world";
const SCHEDULER_ENDPOINT =
  "https://europe-west3-matchscheduler-dev.cloudfunctions.net/getScheduledGames";

export const QWLEAGUE_URL = "https://qwleague.com";
const QWLEAGUE_ENDPOINT = `${QWLEAGUE_URL}/api/upcoming`;

// disabled until qwleague.com gives us access: /api/upcoming does not allow
// cross-origin requests and /api/v1/scheduled-games requires an api token
const QWLEAGUE_ENABLED = false;

const MAX_GAMES = 10;

export type ScheduledTeam = {
  name: string;
  tag: string; // plain text
  tagHtml?: string; // colored quake text
  logoUrl?: string;
};

export type ScheduledGame = {
  id: string;
  source: "scheduler" | "qwleague";
  teamA: ScheduledTeam;
  teamB: ScheduledTeam;
  gameType: string;
  scheduledAt: number; // unix ms
  url: string;
};

// scheduler.quake.world api (subset)
type SchedulerTeam = {
  id: string;
  name: string;
  tag: string;
  logo_url: string;
};

type SchedulerMatch = {
  id: string;
  teamA: SchedulerTeam;
  teamB: SchedulerTeam;
  gameType: string;
  scheduledDateTime: string;
};

async function fetchSchedulerGames(): Promise<ScheduledGame[]> {
  const params = new URLSearchParams({
    limit: String(MAX_GAMES),
    status: "upcoming",
  });
  const res = await fetch(`${SCHEDULER_ENDPOINT}?${params}`);
  if (!res.ok) throw new Error("Failed to fetch scheduler.quake.world games");

  const data = await res.json();
  if (!data.success) throw new Error("scheduler.quake.world returned failure");

  return (data.matches as SchedulerMatch[]).map((m) => ({
    id: `scheduler-${m.id}`,
    source: "scheduler",
    teamA: fromSchedulerTeam(m.teamA),
    teamB: fromSchedulerTeam(m.teamB),
    gameType: m.gameType,
    scheduledAt: Date.parse(m.scheduledDateTime),
    url: `${SCHEDULER_URL}/#/teams/${m.teamA.id}/h2h/${m.teamB.id}`,
  }));
}

const fromSchedulerTeam = (team: SchedulerTeam): ScheduledTeam => ({
  name: team.name,
  tag: team.tag,
  logoUrl: team.logo_url,
});

// qwleague.com api (subset)
type QwleagueClan = {
  id: number;
  name: string;
  team: string; // quake text
  emblem_updated_at: number | null;
};

type QwleagueSide = {
  clan: QwleagueClan | null;
  player: { username?: string; name?: string } | null;
};

type QwleagueItem = {
  type: string;
  fixture_id: number | null;
  tournament: { name: string; slug: string } | null;
  scheduled_at: number; // unix seconds
  status: string;
  side1: QwleagueSide | null;
  side2: QwleagueSide | null;
};

async function fetchQwleagueGames(): Promise<ScheduledGame[]> {
  const res = await fetch(QWLEAGUE_ENDPOINT);
  if (!res.ok) throw new Error("Failed to fetch qwleague.com games");

  const data: { items: QwleagueItem[] } = await res.json();

  return data.items
    .filter((item) => item.status === "upcoming")
    .map((item) => ({
      id: `qwleague-${item.fixture_id ?? `${item.type}-${item.scheduled_at}`}`,
      source: "qwleague",
      teamA: fromQwleagueSide(item.side1),
      teamB: fromQwleagueSide(item.side2),
      gameType: item.type === "prac" ? "practice" : item.type,
      scheduledAt: item.scheduled_at * 1000,
      url: item.tournament
        ? `${QWLEAGUE_URL}/tournaments/${encodeURIComponent(item.tournament.slug)}`
        : QWLEAGUE_URL,
    }));
}

function fromQwleagueSide(side: QwleagueSide | null): ScheduledTeam {
  const clan = side?.clan;

  if (!clan) {
    const name = side?.player?.username || side?.player?.name || "TBD";
    return { name, tag: name };
  }

  const { text, colors } = parseQuakeText(clan.team);

  return {
    name: clan.name,
    tag: text,
    tagHtml: quakeTextToHtml(text, colors),
    logoUrl:
      clan.emblem_updated_at != null
        ? `${QWLEAGUE_URL}/api/clans/${clan.id}/emblem?v=${clan.emblem_updated_at}`
        : undefined,
  };
}

const normalize = (value: string) => value.trim().toLowerCase();

const isSameTeam = (a: ScheduledTeam, b: ScheduledTeam) =>
  normalize(a.name) === normalize(b.name) ||
  normalize(a.tag) === normalize(b.tag);

// same start time and same teams (in any order)
const isSameGame = (a: ScheduledGame, b: ScheduledGame) =>
  a.scheduledAt === b.scheduledAt &&
  ((isSameTeam(a.teamA, b.teamA) && isSameTeam(a.teamB, b.teamB)) ||
    (isSameTeam(a.teamA, b.teamB) && isSameTeam(a.teamB, b.teamA)));

// qwleague wins over the scheduler when both have the same game
export function mergeScheduledGames(
  scheduler: ScheduledGame[],
  qwleague: ScheduledGame[],
): ScheduledGame[] {
  const schedulerOnly = scheduler.filter(
    (game) => !qwleague.some((q) => isSameGame(game, q)),
  );

  return [...qwleague, ...schedulerOnly]
    .sort((a, b) => a.scheduledAt - b.scheduledAt)
    .slice(0, MAX_GAMES);
}

// a failing source does not hide the games of the other one
export async function getScheduledGames(): Promise<ScheduledGame[]> {
  const [scheduler, qwleague] = await Promise.allSettled([
    fetchSchedulerGames(),
    QWLEAGUE_ENABLED ? fetchQwleagueGames() : Promise.resolve([]),
  ]);

  if (scheduler.status === "rejected" && qwleague.status === "rejected") {
    throw scheduler.reason;
  }

  return mergeScheduledGames(
    scheduler.status === "fulfilled" ? scheduler.value : [],
    qwleague.status === "fulfilled" ? qwleague.value : [],
  );
}
