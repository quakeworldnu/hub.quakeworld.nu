import React from "react";
import { SiteHeader } from "@/site/Header";
import { SiteFooter } from "@/site/Footer";
import { RecentDemos } from "@/pages/demos/RecentDemos";

export const App = () => {
  return (
    <div className="flex flex-col h-screen">
      <SiteHeader />

      <div className="my-6 grow">
        <RecentDemos />
      </div>

      <SiteFooter />
    </div>
  );
};

export default App;
