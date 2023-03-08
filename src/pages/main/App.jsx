import React from "react";
import store from "@/store";
import { serversSlice } from "@/services/hub/servers";
import Servers from "@/servers/Servers";
import { SiteFooter } from "@/site/Footer";
import { SiteHeader } from "@/site/Header";

function startPollingDataSources() {
  store.dispatch(
    serversSlice.endpoints.getServers.initiate(
      {},
      { subscriptionOptions: { pollingInterval: 5000 } }
    )
  );
}

export const App = () => {
  startPollingDataSources();

  return (
    <>
      <SiteHeader />
      <Servers />
      <SiteFooter />
    </>
  );
};

export default App;
