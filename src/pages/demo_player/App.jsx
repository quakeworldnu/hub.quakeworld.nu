import React from "react";
import { SiteHeader } from "@qwhub/site/Header";
import { SiteFooter } from "@qwhub/site/Footer";
import { Player } from "@qwhub/pages/demo_player/player/Player";
import { Browser } from "@qwhub/pages/demo_player/browser/Browser";
import { useCurrentDemoId } from "@qwhub/pages/demo_player/playlist/hooks";

export const App = () => {
  const demoId = useCurrentDemoId();

  return (
    <>
      {true && <SiteHeader />}
      <div className="my-6">
        {demoId && <Player demoId={demoId} />}
        {!demoId && <Browser />}
      </div>
      {true && <SiteFooter />}
    </>
  );
};

export default App;
