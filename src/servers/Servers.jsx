import { useSelector } from "react-redux";
import { Server } from "./Server";
import { useGetServersQuery } from "@qwhub/services/hub/hub";
import { gameModes } from "@qwhub/settingsSlice";

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
  const gameModesExcludingOthers = gameModes.slice(0, -1);

  gameModes.forEach((mode) => {
    const includeMode = filters.modes.includes(mode);
    if (!includeMode) {
      if ("other" === mode) {
        filterOperations.push((s) => gameModesExcludingOthers.includes(s.mode));
      } else {
        filterOperations.push((s) => s.mode !== mode);
      }
    }
  });

  if (!filters.only_bots) {
    filterOperations.push((s) => !s.players.every((p) => p.is_bot));
  }

  filterOperations.forEach((filterOp) => {
    servers = servers.filter(filterOp);
  });

  return servers;
}
