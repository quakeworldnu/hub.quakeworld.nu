import { useEffect, useState } from "react";
import { presets, Shortcuts } from "@/components/fte-player/shortcuts";
import { FteQtvPlayer } from "@/features/qtv/components/fte-qtv-player";
import { QtvPlayerFooter } from "@/features/qtv/components/qtv-footer";
import { QtvPlayerSidebar } from "@/features/qtv/components/qtv-sidebar";
import { selectServer } from "@/features/qtv/events";
import { ServerPoller } from "@/features/servers/components/servers";
import { useFteController } from "@/lib/fte/hooks";
import { useQtvServers } from "@/lib/qworld/server-hooks";
import type { Server } from "@/lib/qworld/types";
import { SiteFooter } from "@/pages/layout/site-footer";
import { SiteHeader } from "@/pages/layout/site-header";
import { getSearchParam } from "@/utils/search-params";

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
