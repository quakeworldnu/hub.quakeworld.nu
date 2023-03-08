import React from "react";
import queryString from "query-string";
import { useGetServerQuery } from "@/services/hub/hub";
import { ServerBody } from "@/servers/Server";

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
