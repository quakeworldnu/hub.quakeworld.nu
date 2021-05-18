import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({ servers: state.browser.servers });

const Overview = (props) => {
  const { servers } = props;
  const serverCount = servers.length;

  let playerCount = 0;
  let spectatorCount = 0;
  let meta;

  for (let i = 0; i < serverCount; i++) {
    meta = servers[i].meta;
    playerCount += meta.playerCount;
    spectatorCount += meta.spectatorCount + meta.qtvSpectatorCount;
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
