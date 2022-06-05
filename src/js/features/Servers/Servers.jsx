import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ServerById } from "./ServerById.jsx";
import { useSelector } from "react-redux";
import { selectAllServers } from "../../services/qws/servers.js";

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
          <ServerById key={server.Address} id={server.Address} />
        ))}
      </div>
    </>
  );
}
