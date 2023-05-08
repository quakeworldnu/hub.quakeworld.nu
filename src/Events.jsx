import React from "react";
import { useGetEventsQuery } from "@/services/hub/hub";
import _groupby from "lodash.groupby";
import { Heading } from "./Common";

export default function Events() {
  const { data: events = [] } = useGetEventsQuery();
  const eventsByStatus = _groupby(events, "status");
  const eventKeys = Object.keys(eventsByStatus);
  eventKeys.sort();
  eventKeys.reverse();

  return (
    <>
      {eventKeys.map((k) => (
        <div key={k} className="app-links my-6">
          <Heading text={`${k.toLocaleUpperCase()} EVENTS`} icon="event" />
          {Object.values(eventsByStatus[k])
            .slice(0, 5)
            .map((e, index) => (
              <a href={e.wiki_url} className="block" key={index}>
                <img
                  src={e.logo_url}
                  width={16}
                  height={16}
                  className="inline mr-1"
                />{" "}
                {e.title}
                <span>({e.date})</span>
              </a>
            ))}
        </div>
      ))}
    </>
  );
}
