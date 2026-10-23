import clsx from "clsx";
import { SettingsToggleButton } from "@/features/servers/components/server-filters";
import { isBot } from "@/lib/qworld/server";
import { useFilteredServers } from "@/lib/qworld/server-hooks";
import { totalSpectatorCount } from "@/lib/qworld/server-utils";

export default function SiteNavigation() {
  const servers = useFilteredServers();

  const serverCount = servers.length;
  let playerCount = 0;
  let spectatorCount = 0;
  let qtvCount = 0;

  for (let i = 0; i < serverCount; i++) {
    const server = servers[i];
    playerCount += server.players.filter((p) => !isBot(p)).length;
    spectatorCount += totalSpectatorCount(server);

    if (server.qtv_stream) {
      qtvCount++;
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
      title: "QTV",
      shortDescription: qtvCount,
      longDescription: qtvCount,
      url: "/qtv/",
    },
    {
      title: "Players",
      shortDescription: playerCount + spectatorCount,
      longDescription: `${playerCount} players, ${spectatorCount} spectators`,
      url: "/players/",
    },
    {
      title: "Demos / Recent games",
      shortDescription: "",
      longDescription: "",
      url: "/games/",
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
      <PageSettings />
    </div>
  );
}

const PageSettings = () => {
  const path = location.pathname;

  if (["/", "/players/"].includes(path)) {
    return (
      <span className="ml-auto sm:ml-4">
        <SettingsToggleButton />
      </span>
    );
  }

  return null;
};

const NavLink = ({
  title,
  shortDescription,
  longDescription,
  url,
}: {
  title: string;
  shortDescription: string | number;
  longDescription: string | number;
  url: string;
}) => {
  const isSelected = url === location.pathname;

  const cls = clsx(
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
