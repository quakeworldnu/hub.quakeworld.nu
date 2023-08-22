import { useSelector } from "react-redux";
import { Server } from "./Server";
import { useGetServersQuery } from "@qwhub/services/hub/hub";
import { filterServers } from "@qwhub/serverFilters";

export default function Servers() {
  const serverFilters = useSelector((state) => state.settings.serverFilters);
  let { data: servers = [] } = useGetServersQuery(null, {
    pollingInterval: 5000,
  });

  servers = filterServers(servers, serverFilters);

  return (
    <div className="my-4 mb-6">
      <div className="grid grid-cols-servers gap-4 md:gap-6 lg:gap-8">
        {servers.map((server) => (
          <Server key={server.address} server={server} />
        ))}
      </div>
    </div>
  );
}
