import { selectServer } from "@qwhub/pages/qtv/App.jsx";
import { ServerRow } from "@qwhub/pages/qtv/ServerRow.tsx";
import { selectQtvServers } from "@qwhub/selectors.js";
import { useSelector } from "react-redux";

export function QtvPlayerSidebar() {
  const servers = useSelector(selectQtvServers);

  return (
    <>
      <div className="flex items-center h-10 px-4 bg-[#334] rounded text-sm">
        <div>
          <strong>QTV Servers</strong>{" "}
          <span className="text-slate-400">({servers.length})</span>
        </div>
      </div>
      <div className="">
        {servers.map((server) => (
          <ServerRow
            key={server.address}
            server={server}
            onClick={selectServer}
          />
        ))}
      </div>
    </>
  );
}
