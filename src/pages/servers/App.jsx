import { AllStreams } from "@qwhub/Streams";
import Servers, { ServerPoller } from "@qwhub/servers/Servers";
import { HorizontalSeparator } from "@qwhub/site/Common";
import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";
import React from "react";
import { KoFiGoal } from "./SupportAntilag";

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

        <div className="md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:block 3xl:w-96 gap-4 mb-4">
          <AllStreams />

          <KoFiGoal
            project="carapace51218"
            title="Support Antilag"
            description="Support the continued development of Antilag"
          />
        </div>
      </div>

      <SiteFooter />
      <ServerPoller />
    </>
  );
};

export default App;
