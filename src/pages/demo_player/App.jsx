import React from "react";
import { SiteHeader } from "@qwhub/site/Header";
import { SiteFooter } from "@qwhub/site/Footer";
import { DemoPlayerApp } from "@qwhub/pages/demo_player/DemoPlayer";

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
