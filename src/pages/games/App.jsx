import { GameDetails } from "@qwhub/pages/games/player/GameDetails.tsx";
import { ServerPoller } from "@qwhub/servers/Servers.jsx";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useElementSize } from "usehooks-ts";
import { SiteFooter } from "../../site/Footer";
import { SiteHeader } from "../../site/Header";
import { Sidebar } from "./Sidebar";
import { Browser } from "./browser/Browser";
import { useGames } from "./browser/context.tsx";

import { useCurrentGameId } from "./hooks";

function getAppBodySize() {
  const el = document.getElementById("AppBody");
  if (!el) {
    return { width: 0, height: 0 };
  }
  const { width, height } = el.getBoundingClientRect();
  return { width, height };
}

export const App = () => {
  const gameId = useCurrentGameId();
  const { isLoading } = useGames();

  function handleAppBodySizeChange() {
    dispatchEvent(
      new CustomEvent("app.body.resize", { detail: getAppBodySize() }),
    );
  }

  const [bodyRef, bodySize] = useElementSize();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    handleAppBodySizeChange();
  }, [isLoading]);

  useEffect(() => {
    handleAppBodySizeChange();
  }, [bodySize]);

  return (
    <div className="flex flex-col">
      <SiteHeader />
      <div className="3xl:flex gap-6 my-4">
        <div className="w-full">
          <div id="AppBody" ref={bodyRef}>
            {gameId && <GameDetails id={gameId} />}
            {!gameId && <Browser />}
          </div>
        </div>
        <Sidebar />
      </div>
      <SiteFooter />
      <ServerPoller pollingInterval={30} />
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
