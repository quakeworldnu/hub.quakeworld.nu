import { useEffect } from "react";
import { SiteHeader } from "../../site/Header";
import { SiteFooter } from "../../site/Footer";
import { Player } from "./player/Player";
import { Browser } from "./browser/Browser";
import { useCurrentDemoId } from "./playlist/hooks";
import {
  searchDemosCount,
  searchDemosRows,
} from "./services/supabase/supabase.ts";
import { useDemos } from "./browser/context.tsx";
import { useDemoBrowserSettings } from "./browser/hooks.ts";

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

  return (
    <>
      <SiteHeader />
      <div className="my-6">
        {demoId && <Player demoId={demoId} />}
        {!demoId && <Browser />}
      </div>
      <SiteFooter />
    </>
  );
};

export default App;
