import clsx from "clsx";
import { SettingsToggleButton } from "@/features/servers/components/server-filters";
import { ShowServerScoresToggle } from "@/features/servers/components/show-server-scores-toggle";
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
      description: serverCount,
      url: "/",
    },
    {
      title: "QTV",
      description: qtvCount,
      url: "/qtv/",
    },
    {
      title: "Players",
      description: `${playerCount} players, ${spectatorCount} spectators`,
      url: "/players/",
    },
    {
      title: "Demos / Recent games",
      description: "",
      url: "/games/",
    },
  ];

  return (
    <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-400">
      <div className="flex items-center grow sm:grow-0">
        {pageLinks.map((p) => (
          <NavLink
            key={p.url}
            title={p.title}
            description={p.description}
            url={p.url}
          />
        ))}
        <PageSettings />
      </div>
      {"/" === location.pathname && (
        <div className="hidden xl:block ml-2">
          <ShowServerScoresToggle />
        </div>
      )}
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
  description,
  url,
}: {
  title: string;
  description: string | number;
  url: string;
}) => {
  const isSelected = url === location.pathname;

  const cls = clsx(
    "hover:text-white border-b-2 py-1 mr-2.5 sm:mr-4",
    { "border-sky-600": isSelected },
    { "border-gray-700 hover:border-gray-500": !isSelected },
  );

  return (
    <a href={url} className={cls}>
      <strong>{title}</strong>
      {"" !== description && (
        <span className="text-xs hidden md:inline"> ({description})</span>
      )}
    </a>
  );
};
