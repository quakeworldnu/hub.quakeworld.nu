import React from "react";
import ServerFilters from "../servers/Filters.jsx";
import ServerOverview from "../servers/Overview.jsx";
import Streams from "../Streams.jsx";
import { streamsSlice } from "../services/qws/streams.js";
import store from "./store.js";
import { serversSlice } from "../services/qws/servers.js";
import Servers from "../servers/Servers.jsx";

const AppHeader = () => {
  return (
    <div className="my-3 animation-fade-in-down">
      <div className="columns is-mobile is-vcentered is-multiline">
        <div className="column is-narrow">
          <a
            href="/"
            className="is-flex"
            id="app-logo-link"
          >
            <img src="/assets/img/qtvlogo.svg" width="82" height="59" />
          </a>
        </div>
        <ServerFilters />
        <div className="column has-text-right-desktop">
          <ServerOverview />
        </div>
      </div>

      <Streams />
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
