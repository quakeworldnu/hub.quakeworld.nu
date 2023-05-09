import React from "react";
import {
  useGetEventsQuery,
  useGetGamesInSpotlightQuery,
} from "@/services/hub/hub";
import { Heading } from "./Common";

const LIMIT = 5;
const pollingInterval = 1000 * 1800; // every 30 minutes

export default function GamesInSpotlight() {
  const { data: games = [] } = useGetGamesInSpotlightQuery(null, {
    pollingInterval,
  });
  const { data: events = [] } = useGetEventsQuery(null);

  if (0 === games.length) {
    return <React.Fragment />;
  }

  const hasMoreGamesToShow = games.length > LIMIT;
  let headingText = "GAMES IN SPOTLIGHT";

  if (hasMoreGamesToShow) {
    headingText += ` (${games.length})`;
  }

  return (
    <div className="my-6">
      <Heading text={headingText} icon="whatshot" color={"text-amber-300"} />
      {games.slice(0, LIMIT).map((g, index) => (
        <a
          href={g.event.url}
          className="flex items-center mb-0.5 app-link"
          key={index}
        >
          <EventImage title={g.event.title} events={events} />
          <div>
            <div className="font-bold">{g.participants}</div>
            <span>
              <span className="font-bold">{g.event.title}</span> -{" "}
              {g.description} ({g.date})
            </span>
          </div>
        </a>
      ))}

      {hasMoreGamesToShow && (
        <a
          href="https://www.quakeworld.nu/wiki/Overview"
          className="block mt-2 app-link"
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
