import React from "react";
import {
  useGetEventsQuery,
  useGetGamesInSpotlightQuery,
} from "@/services/hub/hub";

const LIMIT = 5;
const pollingInterval = 1000 * 1800; // every 30 minutes

export default function GamesInSpotlight() {
  const { data: games = [] } = useGetGamesInSpotlightQuery(null, {
    pollingInterval,
  });
  const { data: events = [] } = useGetEventsQuery(null);
  const hasMoreGamesToShow = games.length > LIMIT;

  return (
    <div>
      <div className="font-bold text-gray-300/50 mb-2">
        GAMES IN SPOTLIGHT{" "}
        {hasMoreGamesToShow && (
          <React.Fragment> ({games.length})</React.Fragment>
        )}
      </div>
      {games.slice(0, LIMIT).map((g, index) => (
        <a href={g.event.url} className="flex items-center mb-1" key={index}>
          <EventImage title={g.event.title} events={events} />
          <div>
            <div>
              {g.event.title} - {g.participants}
            </div>
            <span>
              {g.description} ({g.date})
            </span>
          </div>
        </a>
      ))}

      {hasMoreGamesToShow && (
        <a
          href="https://www.quakeworld.nu/wiki/Overview"
          className="block mt-2"
        >
          View all at Wiki &rarr;
        </a>
      )}
    </div>
  );
}

function EventImage({ title = "", events = [] }) {
  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (event.title === title) {
      return (
        <img
          src={event.logo_url}
          width={32}
          height={32}
          alt={event.title}
          className="block mr-2 w-8 h-8"
        />
      );
    }
  }

  return <React.Fragment />;
}
