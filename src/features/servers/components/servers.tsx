import { useServers } from "@/lib/qworld/queries";
import { useFilteredServers } from "@/lib/qworld/server-hooks";
import { Server } from "./server";

export default function Servers() {
  const servers = useFilteredServers();

  return (
    <div className="my-4 mb-6">
      <div className="server-list grid grid-cols-servers gap-4 md:gap-6">
        {servers.map((server) => (
          <Server key={server.address} server={server} />
        ))}
      </div>
    </div>
  );
}

export function ServerPoller({ pollingInterval = 5 }) {
  // pause while page is hidden, refresh immediately when visible again
  useServers({ interval: pollingInterval * 1000, refetchOnFocus: true });
  return null;
}
