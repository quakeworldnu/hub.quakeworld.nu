import React from "react";
import Servers from "@/servers/Servers";
import { SiteFooter } from "@/site/Footer";
import { SiteHeader } from "@/site/Header";

export const App = () => {
  return (
    <>
      <SiteHeader />
      <Servers />
      <SiteFooter />
    </>
  );
};

export default App;
