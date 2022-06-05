import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Server } from "./Server.jsx";
import { useGetMvdsvQuery } from "../../services/qws.js";

export default function Servers() {
  const { data, error, isLoading } = useGetMvdsvQuery(
    {},
    { pollingInterval: 10000 /* ms*/ }
  );

  const [parent] = useAutoAnimate();

  if (error || isLoading || 0 === data.length) {
    return <div ref={parent} />;
  }

  //console.log("Servers");

  return (
    <>
      <div className="app-grid" ref={parent}>
        {data.map((server) => (
          <Server key={server.Address} server={server} />
        ))}
      </div>
    </>
  );
}
