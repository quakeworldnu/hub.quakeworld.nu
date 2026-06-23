import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export function QWLeague() {
  return (
    <a
      href="https://qwleague.com"
      target="_top"
      className="block self-start 3xl:self-stretch border border-orange-900/60 rounded-md p-3 bg-orange-950/40 hover:bg-orange-900/40 hover:border-orange-800/70 transition-colors"
    >
      <div className="flex items-center">
        <img
          src="/assets/img/qwleague_logo.webp"
          alt="QWLeague"
          width="36"
          height="32"
          className="h-8 w-auto"
        />
        <h2 className="ml-3 text-lg font-bold text-orange-500">QWLeague</h2>
        <FontAwesomeIcon
          icon={faChevronRight}
          className="ml-auto text-orange-400/70"
        />
      </div>
      <div className="mt-2 text-sm text-gray-200">
        Elo matchmaking, map veto, dedicated servers.{" "}
        <strong className="text-orange-200">Just play</strong>
      </div>
    </a>
  );
}
