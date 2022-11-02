import React from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Server } from "./Server.jsx";
import { selectAllServers } from "../services/qws/servers.js";

export default function Servers() {
  const [parent] = useAutoAnimate();
  const servers = useSelector(selectAllServers);

  return (
    <div className="my-6 grid grid-cols-servers gap-4 sm:gap-8" ref={parent}>
      {(servers.length > 0) && servers.map((server) => (
        <Server key={server.address} id={server.address} />
      ))}
    </div>
  );
}
