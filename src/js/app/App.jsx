import React from "react";
import store from "./store.js";
import { streamsSlice } from "../services/qws/streams.js";
import { serversSlice } from "../services/qws/servers.js";
import ServerOverview from "../servers/Overview.jsx";
import Streams from "../Streams.jsx";
import Servers from "../servers/Servers.jsx";

const AppHeader = () => {
  return (
    <div className="my-3 animation-fade-in-down">
      <div className="columns is-mobile is-vcentered is-multiline">
        <div className="column is-narrow">
          <a href="/" className="is-flex" id="app-logo-link">
            <img src="/assets/img/qtvlogo.svg" width="82" height="59" />
          </a>
        </div>
        <div className="column is-8-mobile is-9-tablet is-10-desktop is-10-widescreen is-narrow-fullhd">
          <ServerOverview />
        </div>
        <div className="column">
          <Streams />
        </div>
      </div>
    </div>
  );
};

function startPollingDataSources() {
  store.dispatch(
    streamsSlice.endpoints.getStreams.initiate(
      {},
      { subscriptionOptions: { pollingInterval: 15500 } }
    )
  );

  store.dispatch(
    serversSlice.endpoints.getMvdsv.initiate(
      {},
      { subscriptionOptions: { pollingInterval: 5000 } }
    )
  );
}

export const App = () => {
  startPollingDataSources();

  return (
    <>
      <AppHeader />
      <Servers />
    </>
  );
};

export default App;
