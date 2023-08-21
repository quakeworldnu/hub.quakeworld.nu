import { useSelector } from "react-redux";
import { Server } from "./Server";
import { useGetServersQuery } from "@qwhub/services/hub/hub";

export default function Servers() {
  const serverFilters = useSelector((state) => state.settings.serverFilters);
  let { data: servers = [] } = useGetServersQuery(null, {
    pollingInterval: 5000,
  });

  servers = filterServers(servers, serverFilters);

  return (
    <div className="my-4">
      <div className="grid grid-cols-servers gap-4 md:gap-6 lg:gap-8">
        {servers.map((server) => (
          <Server key={server.address} server={server} />
        ))}
      </div>
    </div>
  );
}

function filterServers(servers, filters) {
  const filterOperations = [];

  ["1on1", "2on2", "4on4", "FFA", "Racing", "Fortress"].forEach((mode) => {
    if (!filters.modes.includes(mode)) {
      filterOperations.push((s) => s.mode.toLowerCase() !== mode.toLowerCase());
    }
  });

  if (!filters.only_bots) {
    filterOperations.push((s) => !s.players.every((p) => p.is_bot));
  }

  if (filterOperations.length === 0) {
    return [];
  }

  filterOperations.forEach((filterOp) => {
    servers = servers.filter(filterOp);
  });

  return servers;
}
