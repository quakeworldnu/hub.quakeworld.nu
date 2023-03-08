import React from "react";
//import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Server } from "./Server";
import { useGetServersQuery } from "@/services/hub/hub";

export default function Servers() {
  const { data: servers = [] } = useGetServersQuery(null, {
    pollingInterval: 5000,
  });

  return (
    <div className="my-6">
      <div className="grid grid-cols-servers gap-4 sm:gap-8">
        {
          servers.map((server) => (
            <Server key={server.address} server={server} />
          ))
        }
      </div>
    </div>
  );
}
