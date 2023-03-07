import React from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Server } from "./Server.jsx";
import { selectAllServerAddresses } from "@/services/hub/servers";

export default function Servers() {
  const [parent] = useAutoAnimate();
  const serverAddresses = useSelector(selectAllServerAddresses);
  const hasServers = serverAddresses.length > 0;

  return (
    <div className="my-6">
      <div className="grid grid-cols-servers gap-4 sm:gap-8" ref={parent}>
        {hasServers &&
          serverAddresses.map((address) => (
            <Server key={address} address={address} />
          ))}
      </div>
    </div>
  );
}
