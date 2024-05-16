import { ServerBody } from "@qwhub/servers/Server";
import { useGetServerQuery } from "@qwhub/services/hub/hub";
import queryString from "query-string";
import React from "react";

export const App = () => {
  const { address = "" } = queryString.parse(location.search);
  const { data: server, isSuccess } = useGetServerQuery(address, {
    pollingInterval: 5000,
  });

  return (
    <div className="my-6 h-[400px] max-w-[480px]">
      <>
        {isSuccess && <ServerBody server={server} />}
        {!isSuccess && "Server has no players."}
      </>
    </div>
  );
};

export default App;
