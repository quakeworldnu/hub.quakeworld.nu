import React from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ServerById } from "./ServerById.jsx";
import { selectAllServers } from "../services/qws/servers.js";

export default function Servers() {
  const [parent] = useAutoAnimate();
  const servers = useSelector(selectAllServers);

  if (0 === servers.length) {
    return <div ref={parent} />;
  }

  return (
    <>
      <div className="app-grid" ref={parent}>
        {servers.map((server) => (
          <ServerById key={server.address} id={server.address} />
        ))}
      </div>
    </>
  );
}
