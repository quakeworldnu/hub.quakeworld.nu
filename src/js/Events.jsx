import React from "react";
import { useSelector } from "react-redux";
import { selectAllEvents } from "./services/qws/events.js";
import _groupby from "lodash.groupby";

export default function Events() {
  const events = useSelector(selectAllEvents);

  if (0 === events.length) {
    return <></>
  }

  const eventsByStatus = _groupby(events, "status");

  return (
    <>
      {
        Object.keys(eventsByStatus).map(k => (
          <div className="column" key={k}>
            <div className="has-text-weight-bold has-text-info mb-2">{k.toLocaleUpperCase()} EVENTS</div>
            {
              Object.values(eventsByStatus[k]).slice(0, 5).map((e, index) => (
                <div className="is-flex is-vcentered mb-1" key={index}>
                  <a href={e.wiki_url} className="p-1">
                    <img src={e.logo_url} width={16} height={16} className="mr-2" /> {' '} {e.title}
                    <span className="ml-2 has-text-dark">({e.date})</span>
                  </a>
                </div>
              ))
            }
          </div>
        ))
      }
    </>
  );
}
