import React from "react";
import { Server } from "./Server";
import { useGetServersQuery } from "@qwhub/services/hub/hub";

export default function Servers() {
  const { data: servers = [] } = useGetServersQuery(null, {
    pollingInterval: 5000,
  });

  return (
    <div className="my-4 lg:my-6">
      <div className="grid grid-cols-servers gap-4 md:gap-6 lg:gap-8">
        {servers.map((server) => (
          <Server key={server.address} server={server} />
        ))}
      </div>
    </div>
  );
}
