import clsx from "clsx";
import { useFilteredServers } from "@/lib/qworld/server-hooks";

export default function SiteNavigation() {
  const servers = useFilteredServers();

  const serverCount = servers.length;
  const qtvCount = servers.filter((s) => s.qtv_stream).length;

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
      </div>
    </div>
  );
}

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
