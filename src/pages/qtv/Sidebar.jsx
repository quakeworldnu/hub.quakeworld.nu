import { ServerRow } from "@qwhub/pages/qtv/ServerRow.jsx";
import { selectQtvServers } from "@qwhub/selectors.js";
import { useSelector } from "react-redux";

export function QtvPlayerSidebar() {
  const servers = useSelector(selectQtvServers);

  return (
    <>
      <div className="flex items-center h-12 px-4 bg-white/15">
        QTV Servers ({servers.length})
      </div>
      <div className="">
        {servers.map((server) => (
          <ServerRow key={server.address} server={server} />
        ))}
      </div>
    </>
  );
}
