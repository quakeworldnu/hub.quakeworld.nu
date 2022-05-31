import React from "react";
import { connect } from "react-redux";
import { TextBlur } from "../Animations/Text.jsx";

const mapStateToProps = (state) => ({ servers: state.browser.servers });

const Overview = (props) => {
  const { servers } = props;
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

  const clientCount = playerCount + spectatorCount;

  return (
    <div className="app-text-small" id="app-overview">
      <TextBlur key="clientCount" value={clientCount} /> clients (
      <TextBlur key="playerCount" value={playerCount} /> players,{" "}
      <TextBlur key="spectatorCount" value={spectatorCount} /> spectators)
      across <TextBlur key="serverCount" value={serverCount} /> servers
    </div>
  );
};

const OverviewComponent = connect(mapStateToProps)(Overview);

export default OverviewComponent;
