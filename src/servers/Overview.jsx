import React from "react";
import { useGetServersQuery } from "@/services/hub/hub";

export default function Overview() {
  const { data: servers = [] } = useGetServersQuery(null, {
    pollingInterval: 5000,
  });

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
    <div className="text-sm text-gray-400">
      <a href="/players/" className="hover:text-white">
        {" "}
        {players + spectators} clients ({players} players, {spectators}{" "}
        spectators)
      </a>{" "}
      across{" "}
      <a href="/" className="hover:text-white">
        {servers} servers
      </a>
    </div>
  );
});
