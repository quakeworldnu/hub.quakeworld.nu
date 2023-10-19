import React from "react";
import { SiteHeader } from "@qwhub/site/Header";
import { SiteFooter } from "@qwhub/site/Footer";
import { DemoPlayer } from "@qwhub/pages/demo_player/DemoPlayer";
import queryString from "query-string";
import { Browser } from "@qwhub/pages/demo_player/browser/Browser";

export const App = () => {
  const query = queryString.parse(location.search);
  const demoId = query.demoId ?? "";

  return (
    <>
      {true && <SiteHeader />}
      <div className="my-6">
        {demoId && <DemoPlayer demoId={demoId} />}
        {!demoId && <Browser />}
      </div>
      {true && <SiteFooter />}
    </>
  );
};

export default App;
