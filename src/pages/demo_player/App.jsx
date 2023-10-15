import React from "react";
import { SiteHeader } from "@qwhub/site/Header";
import { SiteFooter } from "@qwhub/site/Footer";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { DemoPlayerApp } from "@qwhub/pages/demo_player/DemoPlayer";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const App = () => {
  return (
    <>
      {true && <SiteHeader />}
      <DemoPlayerApp />
      {true && <SiteFooter />}
    </>
  );
};

export default App;
