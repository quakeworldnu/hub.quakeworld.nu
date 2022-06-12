import React from "react";
import { TextBlur } from "../TextAnimations.jsx";
import { useSelector } from "react-redux";
import { selectAllServers } from "../services/qws/servers.js";

export default function Overview() {
  const servers = useSelector(selectAllServers);
  const serverCount = servers.length;

  let playerCount = 0;
  let spectator_count = 0;

  for (let i = 0; i < serverCount; i++) {
    let server = servers[i];
    playerCount += server.player_slots.used;
    spectator_count += server.spectator_slots.used;

    if ("" !== server.qtv_stream.address) {
      spectator_count += server.qtv_stream.spectator_count;
    }
  }

  return (
    <OverviewStats
      players={playerCount}
      spectators={spectator_count}
      servers={serverCount}
    />
  );
}

const OverviewStats = React.memo((props) => {
  const { players, spectators, servers } = props;

  return (
    <div className="app-text-small" id="app-overview">
      <TextBlur key="clients" value={players + spectators} /> clients (
      <TextBlur key="players" value={players} /> players,{" "}
      <TextBlur key="spectators" value={spectators} /> spectators) across{" "}
      <TextBlur key="servers" value={servers} /> servers
    </div>
  );
});
