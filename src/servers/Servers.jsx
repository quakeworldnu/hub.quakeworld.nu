import { useSelector } from "react-redux";
import { Server } from "./Server";
import { useGetServersQuery } from "@qwhub/services/hub/hub";
import { selectFilteredServers } from "@qwhub/selectors";

export default function Servers() {
  const servers = useSelector(selectFilteredServers);

  return (
    <div className="my-4 mb-6">
      <div className="grid grid-cols-servers gap-4 md:gap-6">
        {servers.map((server) => (
          <Server key={server.address} server={server} />
        ))}
      </div>
    </div>
  );
}

export function ServerPoller({ pollingInterval = 5 }) {
  useGetServersQuery(null, {
    pollingInterval: pollingInterval * 1000,
  });
}
