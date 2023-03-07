import React from "react";
import queryString from "query-string";
import { selectAllServers, serversSlice } from "@/services/hub/servers";
import { ServerBody } from "@/servers/Server";
import store from "@/store";
import { useSelector } from "react-redux";

export const App = () => {
  store.dispatch(
    serversSlice.endpoints.getServers.initiate(
      {},
      { subscriptionOptions: { pollingInterval: 5000 } }
    )
  );

  return (
    <div className="my-6">
      <div className="grid grid-cols-servers gap-4 sm:gap-8">
        <SingleServer />
      </div>
    </div>
  );
};

export const SingleServer = () => {
  const { address = "" } = queryString.parse(location.search);
  const servers = useSelector(selectAllServers);
  let selectedServer = servers.filter((s) =>
    [s.address, s.settings.hostname_parsed].includes(address)
  );
  selectedServer = selectedServer.length > 0 ? selectedServer[0] : false;

  return (
    <>
      {selectedServer && <ServerBody address={selectedServer.address} />}
      {!selectedServer && "Server has no players."}
    </>
  );
};

export default App;
