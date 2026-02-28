import { SecondaryButton } from "@qwhub/Buttons";
import { Heading } from "@qwhub/Common";
import classNames from "classnames";
import { useEffect, useState } from "react";

const WEBSITE_URL = "https://scheduler.quake.world";
const ENDPOINT =
  "https://europe-west3-matchscheduler-dev.cloudfunctions.net/getScheduledGames?limit=10";

export function ScheduledGames({ status = "upcoming", teamTag }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGames() {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (teamTag) params.append("teamTag", teamTag);

        const res = await fetch(`${ENDPOINT}?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch games");

        const data = await res.json();
        if (data.success) {
          setGames(data.matches);
        } else {
          throw new Error("API returned failure");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
    return () => controller.abort();
  }, [status, teamTag]);

  if (loading) return <div className="text-sm text-gray-400">Loading…</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!games.length)
    return <div className="text-sm text-gray-400">No matches found</div>;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Heading text="Scheduled Games" icon="event" iconSize={20} />
        <SecondaryButton className="px-2 text-sm" href={WEBSITE_URL}>
          View all
        </SecondaryButton>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {games.map((match) => (
          <MatchCardCompact key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}

function MatchCardCompact({ match }) {
  const h2hLink = `${WEBSITE_URL}/#/teams/${match.teamA.id}/h2h/${match.teamB.id}`;

  return (
    <a
      href={h2hLink}
      className="p-3 rounded bg-muted/25 hover:bg-muted block w-full max-w-96"
    >
      {/* Teams Row */}
      <div className="flex items-center justify-center gap-0">
        <img
          src={match.teamA.logo_url}
          className="size-8 object-cover shrink-0 mr-2"
          alt={match.teamA.tag}
        />

        <span className="text-sm font-semibold inline-block truncate">
          {match.teamA.tag}
        </span>

        <span className="text-sm text-muted-foreground font-medium mx-2">
          vs
        </span>

        <span className="text-sm font-semibold inline-block text-right truncate">
          {match.teamB.tag}
        </span>

        <img
          src={match.teamB.logo_url}
          className="size-8 object-cover shrink-0 ml-2"
          alt={match.teamB.tag}
        />
      </div>

      <div className="flex items-center justify-center gap-3 mt-0.5">
        <span
          className={classNames("text-xs font-medium uppercase tracking-wide", {
            "text-orange-400": match.gameType === "practice",
            "text-green-600": match.gameType === "official",
          })}
        >
          {match.gameType}
        </span>
        <span className="text-xs text-muted-foreground">
          {match.scheduledDate} {match.slotId?.replace("_", " ").toUpperCase()}
        </span>
      </div>
    </a>
  );
}
