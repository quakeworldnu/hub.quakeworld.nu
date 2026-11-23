import { quakeTextToHtml } from "@/components/ui/quake-text";
import { parseQuakeText } from "@/lib/qworld/quake-text";

export const SCHEDULER_URL = "https://scheduler.quake.world";
const SCHEDULER_ENDPOINT =
  "https://europe-west3-matchscheduler-dev.cloudfunctions.net/getScheduledGames";

export const QWLEAGUE_URL = "https://qwleague.com";
const QWLEAGUE_ENDPOINT = `${QWLEAGUE_URL}/api/public/scheduled-games`;

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

// qwleague.com public api (subset). the public api does not expose clan ids,
// tags or tournament slugs (yet): they are used once it does
type QwleagueClan = {
  name: string;
  id?: number;
  team?: string; // quake text
  emblem_updated_at?: number | null;
};

type QwleagueSide = {
  clan: QwleagueClan | null;
  player: { username?: string; name?: string } | null;
};

export type QwleagueItem = {
  type: string;
  tournament?: { name: string; slug?: string } | null;
  scheduled_at: number; // unix seconds
  status: string;
  side1: QwleagueSide | null;
  side2: QwleagueSide | null;
};

async function fetchQwleagueGames(): Promise<ScheduledGame[]> {
  const res = await fetch(QWLEAGUE_ENDPOINT);
  if (!res.ok) throw new Error("Failed to fetch qwleague.com games");

  const data: { items: QwleagueItem[] } = await res.json();

  return fromQwleagueItems(data.items);
}

export function fromQwleagueItems(items: QwleagueItem[]): ScheduledGame[] {
  return items
    .filter((item) => item.status === "upcoming")
    .map((item) => {
      const teamA = fromQwleagueSide(item.side1);
      const teamB = fromQwleagueSide(item.side2);
      const slug = item.tournament?.slug;

      return {
        id: `qwleague-${item.type}-${item.scheduled_at}-${teamA.name}-${teamB.name}`,
        source: "qwleague",
        teamA,
        teamB,
        gameType: item.type === "prac" ? "practice" : item.type,
        scheduledAt: item.scheduled_at * 1000,
        url: slug
          ? `${QWLEAGUE_URL}/tournaments/${encodeURIComponent(slug)}`
          : QWLEAGUE_URL,
      };
    });
}

function fromQwleagueSide(side: QwleagueSide | null): ScheduledTeam {
  const clan = side?.clan;

  if (!clan) {
    const name = side?.player?.username || side?.player?.name || "TBD";
    return { name, tag: name };
  }

  const team: ScheduledTeam = { name: clan.name, tag: clan.name };

  if (clan.team) {
    const { text, colors } = parseQuakeText(clan.team);
    team.tag = text;
    team.tagHtml = quakeTextToHtml(text, colors);
  }

  if (clan.id != null && clan.emblem_updated_at != null) {
    team.logoUrl = `${QWLEAGUE_URL}/api/clans/${clan.id}/emblem?v=${clan.emblem_updated_at}`;
  }

  return team;
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

// qwleague wins over the scheduler when both have the same game, but borrows
// the tags and logos it is missing from the scheduler
export function mergeScheduledGames(
  scheduler: ScheduledGame[],
  qwleague: ScheduledGame[],
): ScheduledGame[] {
  const schedulerOnly = scheduler.filter(
    (game) => !qwleague.some((q) => isSameGame(game, q)),
  );

  const enriched = qwleague.map((game) => {
    const match = scheduler.find((s) => isSameGame(s, game));
    if (!match) return game;

    const teams = [match.teamA, match.teamB];
    const enrich = (team: ScheduledTeam): ScheduledTeam => {
      const known = teams.find((t) => isSameTeam(t, team));
      if (!known) return team;

      const hasTag = team.tag !== team.name;

      return {
        ...team,
        tag: hasTag ? team.tag : known.tag,
        tagHtml: hasTag ? team.tagHtml : known.tagHtml,
        logoUrl: team.logoUrl ?? known.logoUrl,
      };
    };

    return { ...game, teamA: enrich(game.teamA), teamB: enrich(game.teamB) };
  });

  return [...enriched, ...schedulerOnly]
    .sort((a, b) => a.scheduledAt - b.scheduledAt)
    .slice(0, MAX_GAMES);
}

// a failing source does not hide the games of the other one
export async function getScheduledGames(): Promise<ScheduledGame[]> {
  const [scheduler, qwleague] = await Promise.allSettled([
    fetchSchedulerGames(),
    fetchQwleagueGames(),
  ]);

  if (scheduler.status === "rejected" && qwleague.status === "rejected") {
    throw scheduler.reason;
  }

  return mergeScheduledGames(
    scheduler.status === "fulfilled" ? scheduler.value : [],
    qwleague.status === "fulfilled" ? qwleague.value : [],
  );
}
