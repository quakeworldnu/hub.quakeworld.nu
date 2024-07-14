import { QtvPlayerFooter } from "@qwhub/pages/qtv/Footer.jsx";
import { FteQtvPlayer } from "@qwhub/pages/qtv/FteQtvPlayer";
import { QtvPlayerSidebar } from "@qwhub/pages/qtv/Sidebar.jsx";
import { selectQtvServers } from "@qwhub/selectors.js";
import { ServerPoller } from "@qwhub/servers/Servers";
import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const App = () => {
  return (
    <>
      <SiteHeader />
      <QtvPage />
      <SiteFooter />
      <ServerPoller pollingInterval={15} />
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

    setServer(servers[0]);
  }, [servers]);

  return server;
}

const QtvPage = () => {
  const server = useInitialServer();

  useEffect(() => {
    if (server) {
      selectServer(server);
    }
  }, [server]);

  return (
    <div>
      <div className="md:flex gap-x-4 ">
        <div className="my-4 flex flex-col w-full">
          <div className="grow">
            <FteQtvPlayer />
          </div>
          <QtvPlayerFooter />
        </div>

        <div className="md:w-1/3 xl:w-1/4 order-first my-4">
          <QtvPlayerSidebar />
        </div>
      </div>
    </div>
  );
};

export function selectServer(server) {
  window.dispatchEvent(new CustomEvent("hub.selectServer", { detail: server }));
}
