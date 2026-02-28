import { AllStreams } from "@qwhub/Streams";
import Servers, { ServerPoller } from "@qwhub/servers/Servers";
import { HorizontalSeparator } from "@qwhub/site/Common";
import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";
import React from "react";
import { ScheduledGames } from "./ScheduledGames";
import { KoFiGoal } from "./SupportAntilag";

export const App = () => {
  return (
    <>
      <SiteHeader />
      <div className="3xl:flex 3xl:gap-x-8 4xl:gap-x-10">
        <div className="grow">
          <Servers />
        </div>

        <div className="w-full 3xl:hidden my-4">
          <HorizontalSeparator />
        </div>

        <div className="flex flex-row flex-wrap my-4 gap-y-6 gap-x-8 3xl:w-96 3xl:flex-col">
          <KoFiGoal
            project="carapace51218"
            title="Support Antilag"
            description="Support the continued development of Antilag"
          />
          <ScheduledGames />
          <AllStreams />
        </div>
      </div>

      <SiteFooter />
      <ServerPoller />
    </>
  );
};

export default App;
