import { useFteController } from "@qwhub/pages/games/fte/hooks";
import {
  presets,
  Shortcuts,
} from "@qwhub/pages/games/fte/player/Shortcuts.tsx";
import { getSearchParam } from "@qwhub/pages/qtv/url";
import { useQtvServers } from "@qwhub/servers/hooks.ts";
import { ServerPoller } from "@qwhub/servers/Servers";
import type { Server } from "@qwhub/services/qworld/types.ts";
import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";
import { useEffect, useState } from "react";
import { selectServer } from "./events";
import { QtvPlayerFooter } from "./Footer";
import { FteQtvPlayer } from "./FteQtvPlayer";
import { QtvPlayerSidebar } from "./Sidebar";

export const App = () => {
  return (
    <>
      <SiteHeader />
      <QtvPage />
      <SiteFooter />
      <ServerPoller />
    </>
  );
};

export default App;

function useInitialServer() {
  const [server, setServer] = useState<Server | null>(null);
  const servers = useQtvServers();

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
                mapName={server.info.map}
                timelimit={Number.parseInt(server.info.timelimit, 10)}
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
