import classNames from "classnames";
import { SettingsToggleButton } from "@qwhub/site/Settings";
import { useGetServersQuery } from "@qwhub/services/hub/hub";

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
      title: "Demos",
      shortDescription: "",
      longDescription: "",
      url: "/demos/",
    },
  ];

  return (
    <div className="flex items-center text-xs sm:text-sm text-gray-400">
      {pageLinks.map((p) => (
        <NavLink
          key={p.url}
          title={p.title}
          shortDescription={p.shortDescription}
          longDescription={p.longDescription}
          url={p.url}
        />
      ))}
      <span className="ml-auto sm:ml-4">
        <SettingsToggleButton />
      </span>
    </div>
  );
}

const NavLink = ({ title, shortDescription, longDescription, url }) => {
  const isSelected = url === location.pathname;

  const cls = classNames(
    "hover:text-white border-b-2 py-1 mr-2.5 sm:mr-4",
    { "border-sky-600": isSelected },
    { "border-gray-700 hover:border-gray-500": !isSelected },
  );

  const hasDescription = `${shortDescription}${longDescription}`.length > 0;

  return (
    <a href={url} className={cls}>
      <strong>{title}</strong>
      {hasDescription && (
        <>
          {" "}
          <span className="text-xs sm:hidden">({shortDescription})</span>
          <span className="text-xs hidden sm:inline">({longDescription})</span>
        </>
      )}
    </a>
  );
};
