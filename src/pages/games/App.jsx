import { GameDetails } from "@qwhub/pages/games/player/GameDetails.tsx";
import { ServerPoller } from "@qwhub/servers/Servers.jsx";
import { ToastContainer } from "react-toastify";
import { SiteFooter } from "../../site/Footer";
import { SiteHeader } from "../../site/Header";
import { Sidebar } from "./Sidebar";
import { Browser } from "./browser/Browser";

import { useCurrentGameId } from "./hooks";

export const App = () => {
  const gameId = useCurrentGameId();

  return (
    <div className="flex flex-col">
      <SiteHeader />
      <div className="3xl:flex gap-6 my-4">
        <div className="w-full">
          <div>
            {gameId && <GameDetails id={gameId} />}
            {!gameId && <Browser />}
          </div>
        </div>
        <Sidebar />
      </div>
      <SiteFooter />
      <ServerPoller />
      <ToastContainer
        hideProgressBar
        position="bottom-right"
        theme="dark"
        autoClose={1500}
      />
    </div>
  );
};

export default App;
