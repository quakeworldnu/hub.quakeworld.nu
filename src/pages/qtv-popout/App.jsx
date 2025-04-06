import { useFteController } from "@qwhub/pages/games/fte/hooks";
import { FteQtvPlayer } from "@qwhub/pages/qtv/FteQtvPlayer";
import { selectServer } from "@qwhub/pages/qtv/events";
import { getSearchParam } from "@qwhub/pages/qtv/url";
import { selectQtvServers } from "@qwhub/selectors";
import { ServerPoller } from "@qwhub/servers/Servers";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const App = () => {
  return (
    <>
      <QtvPage />
      <ServerPoller pollingInterval={10} />
    </>
  );
};

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
    <>
      {server && (
        <FteQtvPlayer
          mapName={server.settings.map}
          timelimit={Number.parseInt(server.settings.timelimit)}
          fullscreen
        />
      )}
    </>
  );
};
