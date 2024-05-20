import Events from "@qwhub/Events";
import ForumPosts from "@qwhub/ForumPosts";
import GamesInSpotlight from "@qwhub/GamesInSpotlight";
import News from "@qwhub/News";
import { AllStreams } from "@qwhub/Streams";
import WikiRecentChanges from "@qwhub/WikiRecentChanges";
import Servers, { ServerPoller } from "@qwhub/servers/Servers";
import { HorizontalSeparator } from "@qwhub/site/Common";
import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";
import React from "react";

export const App = () => {
  return (
    <>
      <SiteHeader />
      <div className="3xl:flex 3xl:gap-x-8 4xl:gap-x-10">
        <div className="grow">
          <Servers />
        </div>

        <div className="3xl:hidden">
          <HorizontalSeparator />
        </div>

        <div className="md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:block 3xl:w-96 gap-x-4">
          <AllStreams />
          <GamesInSpotlight />
          <Events />
          <div className="3xl:hidden">
            <News />
          </div>
          <div className="3xl:hidden">
            <ForumPosts />
          </div>
          <div className="3xl:hidden">
            <WikiRecentChanges />
          </div>
        </div>
      </div>

      <div className="hidden 3xl:block">
        <HorizontalSeparator />
        <div className="3xl:grid 3xl:grid-cols-4 gap-x-4">
          <News />
          <ForumPosts />
          <WikiRecentChanges />
        </div>
      </div>

      <SiteFooter />
      <ServerPoller />
    </>
  );
};

export default App;
