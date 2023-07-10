import React from "react";
import { useGetServersQuery } from "@/services/hub/hub";
import classNames from "classnames";

export default function SiteNavigation() {
  const { data: servers = [] } = useGetServersQuery(null, {
    pollingInterval: 5000,
  });

  const serverCount = servers.length;
  let playerCount = 0;
  let spectatorCount = 0;

  for (let i = 0; i < serverCount; i++) {
    const server = servers[i];
    playerCount += server.players.filter((p) => !p.is_bot).length;
    spectatorCount += server.spectator_slots.used;

    if ("" !== server.qtv_stream.address) {
      spectatorCount += server.qtv_stream.spectator_count;
    }
  }

  const pageLinks = [
    {
      title: "Servers",
      shortDescription: serverCount,
      longDescription: serverCount,
      url: "/",
    },
    {
      title: "Players",
      shortDescription: playerCount + spectatorCount,
      longDescription: `${playerCount} players, ${spectatorCount} spectators`,
      url: "/players/",
    },
    {
      title: "Recent Demos",
      shortDescription: "",
      longDescription: "",
      url: "/demos/",
    },
  ];

  return (
    <div className="text-xs sm:text-sm text-gray-400 space-x-4">
      {pageLinks.map((p) => (
        <NavLink
          key={p.url}
          title={p.title}
          shortDescription={p.shortDescription}
          longDescription={p.longDescription}
          url={p.url}
        />
      ))}
    </div>
  );
}

const NavLink = ({ title, shortDescription, longDescription, url }) => {
  const isSelected = url === location.pathname;

  const cls = classNames(
    "hover:text-white underline underline-offset-8 decoration-2",
    { "decoration-sky-600": isSelected },
    { "decoration-gray-700 hover:decoration-gray-500": !isSelected },
  );

  const hasDescription = `${shortDescription}${longDescription}`.length > 0;

  return (
    <a href={url} className={cls}>
      <strong>{title}</strong>
      {hasDescription && (
        <>
          {" "}
          <span className="text-xs sm:hidden">({shortDescription})</span>{" "}
          <span className="text-xs hidden sm:inline">({longDescription})</span>
        </>
      )}
    </a>
  );
};
