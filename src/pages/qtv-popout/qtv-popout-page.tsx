import { useEffect, useState } from "react";
import { FteQtvPlayer } from "@/features/qtv/components/fte-qtv-player";
import { selectServer } from "@/features/qtv/events";
import { ServerPoller } from "@/features/servers/components/servers";
import { useFteController } from "@/lib/fte/hooks";
import { useQtvServers } from "@/lib/qworld/server-hooks";
import type { Server } from "@/lib/qworld/types";
import { getSearchParam } from "@/utils/search-params";

export const App = () => {
  return (
    <>
      <QtvPage />
      <ServerPoller />
    </>
  );
};

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
    <>
      {server && (
        <FteQtvPlayer
          mapName={server.info.map}
          timelimit={Number.parseInt(server.info.timelimit, 10)}
          fullscreen
        />
      )}
    </>
  );
};
