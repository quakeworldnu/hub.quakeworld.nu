import { useFteController } from "@qwhub/pages/games/fte/hooks";
import { Shortcuts, presets } from "@qwhub/pages/games/player/Shortcuts.tsx";
import { getSearchParam } from "@qwhub/pages/qtv/url";
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

    const address = getSearchParam("address");
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
            {server && (
              <FteQtvPlayer
                mapName={server.settings.map}
                timelimit={server.settings.timelimit}
              />
            )}
          </div>
          <QtvPlayerFooter />
        </div>

        <div className="lg:w-1/2 xl:w-1/3 lg:max-w-[540px] order-first my-4 max-h-[80vh] overflow-auto">
          <QtvPlayerSidebar />

          <div className="lg:hidden">
            <hr className="my-6 border-slate-800" />
            <Shortcuts preset={presets.qtvPlayer} />
          </div>
        </div>
      </div>
    </div>
  );
};
