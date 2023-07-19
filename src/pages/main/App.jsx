import React from "react";
import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";
import Servers from "@qwhub/servers/Servers";
import GamesInSpotlight from "@qwhub/GamesInSpotlight";
import Events from "@qwhub/Events";
import { HorizontalSeparator } from "@qwhub/site/Common";
import News from "@qwhub/News";
import ForumPosts from "@qwhub/ForumPosts";
import WikiRecentChanges from "@qwhub/WikiRecentChanges";

export const App = () => {
  return (
    <>
      <SiteHeader />
      <div className="3xl:flex 3xl:gap-x-12">
        <div className="grow">
          <Servers />
        </div>

        <div className="3xl:hidden">
          <HorizontalSeparator />
        </div>

        <div className="md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:block 3xl:w-80">
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
        <div className="3xl:grid 3xl:grid-cols-4">
          <News />
          <ForumPosts />
          <WikiRecentChanges />
        </div>
      </div>

      <SiteFooter />
    </>
  );
};

export default App;
