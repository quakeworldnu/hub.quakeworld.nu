import { selectServer } from "@/features/qtv/events";
import { useQtvServers } from "@/lib/qworld/server-hooks";
import type { Server } from "@/lib/qworld/types";
import { ServerRow } from "./server-row";

export function QtvPlayerSidebar() {
  const servers: Server[] = useQtvServers();

  return (
    <>
      <div className="flex items-center h-10 px-4 bg-[#334] rounded text-sm">
        <div>
          <strong>QTV Servers</strong>{" "}
          <span className="text-slate-400">({servers.length})</span>
        </div>
      </div>
      <div>
        {0 === servers.length && (
          <div className="py-4  text-center text-sm text-slate-400">
            no active servers available
          </div>
        )}

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
