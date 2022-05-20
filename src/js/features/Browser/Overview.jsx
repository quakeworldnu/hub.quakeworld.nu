import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({ servers: state.browser.servers });

const Overview = (props) => {
  const { servers } = props;
  const serverCount = servers.length;

  let playerCount = 0;
  let spectatorCount = 0;

  for (let i = 0; i < serverCount; i++) {
    let server = servers[i];
    playerCount += server.PlayerSlots.Used;
    spectatorCount += server.SpectatorSlots.Used

    if ("" !== server.QtvStream.Address) {
      spectatorCount += server.QtvStream.NumSpectators
    }
  }

  const clientCount = playerCount + spectatorCount;

  return (
    <div className="app-text-small" id="app-overview">
      {clientCount} clients ({playerCount} players, {spectatorCount} spectators)
      across {serverCount} servers
    </div>
  );
};

const OverviewComponent = connect(mapStateToProps)(Overview);

export default OverviewComponent;
