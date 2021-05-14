import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({ servers: state.servers.entries });

const Overview = (props) => {
  const { servers } = props;
  const serverCount = servers.length;

  let totalClientCount = 0;
  let totalPlayCount = 0;
  let totalSpecCount = 0;
  let clientCount = 0;
  let playCount = 0;
  let specCount = 0;

  for (let i = 0; i < serverCount; i++) {
    clientCount = servers[i].Players.length;
    totalClientCount += clientCount;

    specCount = servers[i].Players.filter((p) => p.Spec).length;
    totalSpecCount += specCount;

    playCount = clientCount - specCount;
    totalPlayCount += playCount;
  }

  return (
    <div>
      {totalClientCount} players ({totalPlayCount} playing, {totalSpecCount}{" "}
      spectators) across {serverCount} servers
    </div>
  );
};

const OverviewComponent = connect(mapStateToProps)(Overview);

export default OverviewComponent;
