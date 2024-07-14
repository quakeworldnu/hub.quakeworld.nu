import { useFteController } from "@qwhub/pages/games/fte/hooks";
import { selectQtvServers } from "@qwhub/selectors";
import { ServerPoller } from "@qwhub/servers/Servers";
import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { QtvPlayerFooter } from "./Footer";
import { FteQtvPlayer } from "./FteQtvPlayer";
import { QtvPlayerSidebar } from "./Sidebar";
import { selectServer } from "./events";

export const App = () => {
  return (
    <>
      <SiteHeader />
      <QtvPage />
      <SiteFooter />
      <ServerPoller pollingInterval={10} />
    </>
  );
};

export default App;

function useInitialServer() {
  const [server, setServer] = useState(null);
  const servers = useSelector(selectQtvServers);

  useEffect(() => {
    if (!servers || server) {
      return;
    }

    const address = new URLSearchParams(window.location.search).get("address");
    const selectedServer =
      servers.find((s) => s.address === address) || servers[0];
    setServer(selectedServer);
  }, [servers]);

  return server;
}

const QtvPage = () => {
  const server = useInitialServer();
  const fte = useFteController();

  useEffect(() => {
    if (server) {
      selectServer(server);
    }
  }, [server]);

  useEffect(() => {
    if (fte && server) {
      selectServer(server);
    }
  }, [fte]);

  return (
    <div>
      <div className="lg:flex gap-x-4 ">
        <div className="my-4 flex flex-col w-full">
          <div className="grow">
            <FteQtvPlayer />
          </div>
          <QtvPlayerFooter />
        </div>

        <div className="lg:w-1/2 xl:w-1/3 max-w-[540px] order-first my-4">
          <QtvPlayerSidebar />
        </div>
      </div>
    </div>
  );
};
