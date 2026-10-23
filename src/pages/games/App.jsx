import { GameDetails } from "@qwhub/pages/games/fte/player/GameDetails.tsx";
import { ServerPoller } from "@qwhub/servers/Servers.jsx";
import { Toaster } from "@qwhub/Toast.tsx";
import { StrictMode } from "react";
import { SiteFooter } from "../../site/Footer";
import { SiteHeader } from "../../site/Header";
import { Browser } from "./browser/Browser";
import { useCurrentGameId } from "./hooks";
import { Sidebar } from "./Sidebar";

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
      <Toaster />
    </div>
  );
};

export default App;
