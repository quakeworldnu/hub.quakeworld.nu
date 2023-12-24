import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { SiteHeader } from "../../site/Header";
import { SiteFooter } from "../../site/Footer";
import { Browser } from "./browser/Browser";
import { useCurrentDemoId } from "./playlist/hooks";
import {
  searchDemosCount,
  searchDemosRows,
} from "./services/supabase/supabase.ts";
import { useDemos } from "./browser/context.tsx";
import { useDemoBrowserSettings } from "./browser/hooks.ts";
import { Sidebar } from "./Sidebar";
import { Player } from "@qwhub/pages/games/player/Player";
import { useElementSize } from "usehooks-ts";
import { ServerPoller } from "@qwhub/servers/Servers.jsx";

function getAppBodySize() {
  const el = document.getElementById("AppBody");
  if (!el) {
    return { width: 0, height: 0 };
  }
  const { width, height } = el.getBoundingClientRect();
  return { width, height };
}

export const App = () => {
  const demoId = useCurrentDemoId();
  const { settings, setPage } = useDemoBrowserSettings();
  const { setDemos, setCount, setIsLoading, isLoading } = useDemos();

  function handleAppBodySizeChange() {
    dispatchEvent(
      new CustomEvent("app.body.resize", { detail: getAppBodySize() }),
    );
  }

  useEffect(() => {
    async function run() {
      setIsLoading(true);
      const { data: demos } = await searchDemosRows(settings);
      const { data: count } = await searchDemosCount(settings);
      setDemos(demos);
      setCount(count.count);
      setPage(1);
      setIsLoading(false);
    }

    run();
  }, [settings.query, settings.gameMode]);

  useEffect(() => {
    async function run() {
      setIsLoading(true);
      const { data: demos } = await searchDemosRows(settings);
      setDemos(demos);
      setIsLoading(false);
    }

    run();
  }, [settings.page]);

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
      <div className="3xl:flex gap-6 my-6">
        <div className="w-full">
          <div id="AppBody" ref={bodyRef}>
            {demoId && <Player demoId={demoId} />}
            {!demoId && <Browser />}
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
