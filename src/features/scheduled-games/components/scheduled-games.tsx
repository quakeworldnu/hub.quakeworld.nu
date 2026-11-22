import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import type { ReactNode } from "react";
import { QWLeagueBanner } from "@/components/scoreboard/qwleague-banner";
import { SecondaryButton } from "@/components/ui/buttons";
import { Heading } from "@/components/ui/heading";
import { QuakeText } from "@/components/ui/quake-text";
import {
  getScheduledGames,
  SCHEDULER_URL,
  type ScheduledGame,
  type ScheduledTeam,
} from "@/features/scheduled-games/api";

export function ScheduledGames() {
  const {
    data: games = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["scheduledGames"],
    queryFn: getScheduledGames,
  });

  if (isPending) return <div className="text-sm text-gray-400">Loading…</div>;
  if (error) return <div className="text-sm text-red-500">{error.message}</div>;
  if (!games.length) return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Heading text="Scheduled Games" icon="event" iconSize={20} />
        <SecondaryButton className="px-2 text-sm" href={SCHEDULER_URL}>
          View all
        </SecondaryButton>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {games.map((game) => (
          <MatchCardCompact key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

function MatchCardCompact({ game }: { game: ScheduledGame }) {
  return (
    <a
      href={game.url}
      className="rounded overflow-hidden bg-muted/25 hover:bg-muted block w-full max-w-96"
    >
      {game.source === "qwleague" && <QWLeagueBanner isLink={false} />}

      <div className="p-3">
        {/* Teams Row */}
        <div className="flex items-center justify-center gap-0">
          <TeamLogo team={game.teamA} className="mr-2" />
          <TeamTag team={game.teamA} />

          <span className="text-sm text-muted-foreground font-medium mx-2">
            vs
          </span>

          <TeamTag team={game.teamB} className="text-right" />
          <TeamLogo team={game.teamB} className="ml-2" />
        </div>

        <div className="flex items-center justify-center gap-3 mt-0.5">
          <span
            className={clsx("text-xs font-medium uppercase tracking-wide", {
              "text-orange-400": game.gameType === "practice",
              "text-green-600": game.gameType === "official",
            })}
          >
            {game.gameType}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatScheduledAt(game.scheduledAt)}
          </span>
        </div>
      </div>
    </a>
  );
}

function TeamTag({
  team,
  className,
}: {
  team: ScheduledTeam;
  className?: string;
}) {
  const classNames = clsx(
    "text-sm font-semibold inline-block truncate",
    className,
  );

  if (team.tagHtml) {
    return <QuakeText tag="span" text={team.tagHtml} className={classNames} />;
  }

  return <span className={classNames}>{team.tag}</span>;
}

function TeamLogo({
  team,
  className,
}: {
  team: ScheduledTeam;
  className?: string;
}) {
  if (!team.logoUrl) {
    return <span className={clsx("size-8 shrink-0", className)} />;
  }

  return (
    <img
      src={team.logoUrl}
      className={clsx("size-8 object-cover shrink-0", className)}
      alt={team.tag}
    />
  );
}

function formatScheduledAt(timestamp: number): ReactNode {
  const date = new Date(timestamp); // local time
  const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, "0");

  // Check if the date is today in local time
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  if (isToday) {
    return (
      <strong>
        Today at {hours}:{minutes}
      </strong>
    );
  } else {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}
