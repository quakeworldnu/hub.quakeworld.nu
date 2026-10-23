import { GameDetails } from "@qwhub/pages/games/player/GameDetails.tsx";
import { ServerPoller } from "@qwhub/servers/Servers.jsx";
import { StrictMode } from "react";
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
            {/* strict mode except for the demo player (fte engine is a global singleton) */}
            {!gameId && (
              <StrictMode>
                <Browser />
              </StrictMode>
            )}
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
