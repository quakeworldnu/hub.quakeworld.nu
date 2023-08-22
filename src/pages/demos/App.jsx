import React from "react";
import { SiteHeader } from "@qwhub/site/Header";
import { SiteFooter } from "@qwhub/site/Footer";
import { RecentDemos } from "@qwhub/pages/demos/RecentDemos";
import { ServerPoller } from "@qwhub/servers/Servers";

export const App = () => {
  return (
    <div className="flex flex-col h-screen">
      <SiteHeader />

      <div className="my-6 grow">
        <RecentDemos />
      </div>

      <SiteFooter />
      <ServerPoller />
    </div>
  );
};

export default App;
