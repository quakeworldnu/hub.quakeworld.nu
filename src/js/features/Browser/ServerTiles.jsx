import React from "react";
import { connect } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Server } from "./Server";
import { filterServers } from "../../common/filter";

const ServerTiles = (props) => {
  const { servers } = props;
  const [parent] = useAutoAnimate();

  return (
    <>
      <div className="app-grid" ref={parent}>
        {servers.map((server) => (
          <Server key={server.Address} server={server} />
        ))}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  servers: filterServers(
    state.browser.servers,
    state.browser.ui.filters,
    state.browser.ui.favorites.servers
  ),
});

const ServerTilesComponent = connect(mapStateToProps)(ServerTiles);

export default ServerTilesComponent;
