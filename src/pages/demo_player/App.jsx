import { useEffect } from "react";
import { SiteHeader } from "../../site/Header";
import { SiteFooter } from "../../site/Footer";
import { Player } from "./player/Player";
import { Browser } from "./browser/Browser";
import { useCurrentDemoId } from "./playlist/hooks";
import { searchDemos } from "./services/supabase/supabase.ts";
import { useDemos } from "./browser/context.tsx";
import { useDemoBrowserSettings } from "./browser/hooks.ts";

export const App = () => {
  const demoId = useCurrentDemoId();
  const { settings, setPage } = useDemoBrowserSettings();
  const { setDemos, setIsLoading } = useDemos();

  useEffect(() => {
    async function run() {
      setIsLoading(true);
      const { demos, count } = await searchDemos(settings);
      setDemos(demos, count);
      setPage(1);
      setIsLoading(false);
    }

    run();
  }, [settings.query, settings.gameMode]);

  useEffect(() => {
    async function run() {
      setIsLoading(true);
      const { demos, count } = await searchDemos(settings);
      setDemos(demos, count);
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
