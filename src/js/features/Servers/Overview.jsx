import React from "react";
import { TextBlur } from "../TextAnimations.jsx";
import { useSelector } from "react-redux";
import { selectAllServers } from "../../services/qws/servers.js";

export default function Overview() {
  const servers = useSelector(selectAllServers);
  const serverCount = servers.length;

  let playerCount = 0;
  let spectatorCount = 0;

  for (let i = 0; i < serverCount; i++) {
    let server = servers[i];
    playerCount += server.PlayerSlots.Used;
    spectatorCount += server.SpectatorSlots.Used;

    if ("" !== server.QtvStream.Address) {
      spectatorCount += server.QtvStream.SpectatorCount;
    }
  }

  return (
    <OverviewStats
      players={playerCount}
      spectators={spectatorCount}
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
