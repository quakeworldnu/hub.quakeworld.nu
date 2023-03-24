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
    let server = servers[i];
    playerCount += server.player_slots.used;
    spectatorCount += server.spectator_slots.used;

    if ("" !== server.qtv_stream.address) {
      spectatorCount += server.qtv_stream.spectator_count;
    }
  }

  const pageLinks = [
    { title: "Servers", description: serverCount, url: "/" },
    {
      title: "Players",
      description: playerCount,
      url: "/players/",
    },
  ];

  return (
    <div className="text-xs sm:text-sm text-gray-400 space-x-4">
      {pageLinks.map((p) => (
        <NavLink
          key={p.url}
          title={p.title}
          description={p.description}
          url={p.url}
        />
      ))}
    </div>
  );
}

const NavLink = ({ title, description, url }) => {
  const isSelected = url === location.pathname;

  const cls = classNames(
    "hover:text-white underline underline-offset-8 decoration-2",
    { "decoration-sky-600": isSelected },
    { "decoration-gray-700 hover:decoration-gray-500": !isSelected }
  );

  return (
    <a href={url} className={cls}>
      <strong>{title}</strong> <span className="text-xs">({description})</span>
    </a>
  );
};
