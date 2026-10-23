import { StrictMode } from "react";
import { Toaster } from "@/components/ui/toast";
import { Browser } from "@/features/demo-browser/components/browser";
import { GameDetails } from "@/features/demo-player/components/game-details";
import { ServerPoller } from "@/features/servers/components/servers";
import { SiteFooter } from "@/pages/layout/site-footer";
import { SiteHeader } from "@/pages/layout/site-header";
import { useCurrentGameId } from "@/utils/game-url";
import { Sidebar } from "./sidebar";

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
