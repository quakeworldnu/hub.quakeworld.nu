import React from "react";
import { useGetEventsQuery } from "@/services/hub/hub";
import _groupby from "lodash.groupby";

export default function Events() {
  const { data: events, isSuccess } = useGetEventsQuery('bulbasaur')

  if (!isSuccess) {
    return <></>;
  }

  const eventsByStatus = _groupby(events, "status");

  return (
    <>
      {Object.keys(eventsByStatus).map((k) => (
        <div key={k}>
          <div className="font-bold text-gray-300/50 mb-2">
            {k.toLocaleUpperCase()} EVENTS
          </div>
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
