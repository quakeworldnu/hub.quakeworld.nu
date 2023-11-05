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
import { Player } from "@qwhub/pages/recent_games/player/Player";
import { useThrottledElementSize } from "@qwhub/pages/recent_games/hooks";

export const App = () => {
  const demoId = useCurrentDemoId();
  const { settings, setPage } = useDemoBrowserSettings();
  const { setDemos, setCount, setIsLoading } = useDemos();

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

  const [bodyRef, bodySize] = useThrottledElementSize();
  useEffect(() => {
    dispatchEvent(new CustomEvent("app.body.resize", { detail: bodySize }));
  }, [bodySize]);

  return (
    <div className="flex flex-col">
      <SiteHeader />
      <div className="lg:flex gap-6 my-6">
        <div className="w-full">
          <div id="AppBody" ref={bodyRef}>
            {demoId && <Player demoId={demoId} />}
            {!demoId && <Browser />}
          </div>
        </div>
        <Sidebar />
      </div>
      <SiteFooter />
      <ToastContainer hideProgressBar position="bottom-right" theme="dark" />
    </div>
  );
};

export default App;
