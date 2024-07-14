import { QtvPlayer } from "@qwhub/pages/qtv/Player.jsx";
import { QtvPlayerSidebar } from "@qwhub/pages/qtv/Sidebar.jsx";
import { ServerPoller } from "@qwhub/servers/Servers";
import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";
import React from "react";

export const App = () => {
  return (
    <>
      <SiteHeader />
      <QtvPage />
      <SiteFooter />
      <ServerPoller pollingInterval={15} />
    </>
  );
};

export default App;

const QtvPage = () => {
  return (
    <div className="my-6 debug">
      <div className="md:flex">
        <div className="grow bg-white/10">
          <QtvPlayer />
        </div>

        <div className="md:w-1/3 xl:w-1/4 2xl:w-1/5 order-first">
          <QtvPlayerSidebar />
        </div>
      </div>
    </div>
  );
};
