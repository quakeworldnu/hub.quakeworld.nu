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
    <div className="my-6 h-[400px] max-w-[480px]">
      <SingleServer />
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
