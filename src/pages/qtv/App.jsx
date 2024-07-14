import { FteQtvPlayer } from "@qwhub/pages/qtv/FteQtvPlayer";
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
    <div>
      <div className="md:flex gap-x-4 ">
        <div className="grow my-4">
          <FteQtvPlayer />
        </div>

        <div className="md:w-1/3 xl:w-1/4 2xl:w-1/5 order-first my-4">
          <QtvPlayerSidebar />
        </div>
      </div>
    </div>
  );
};
