import React from "react";
import Filters from "./Filters";
import Overview from "./Overview";
import ServerDataSource from "./ServerDataSource";
import ServerTiles from "./ServerTiles.jsx";
import Streams from "./Streams/Streams.jsx";

const BrowserHeader = React.memo(() => {
  return (
    <div className="my-3">
      <div className="columns is-mobile is-vcentered is-multiline">
        <div className="column is-narrow">
          <a href="/" className="is-flex" id="app-logo-link">
            <img src="/assets/img/qtvlogo.svg" width="82" height="59" />
          </a>
        </div>
        <Filters />
        <div className="column has-text-right-desktop">
          <Overview />
        </div>
      </div>

      <Streams />
    </div>
  );
});

export const Browser = () => (
  <>
    <ServerDataSource />
    <BrowserHeader />
    <ServerTiles />
  </>
);

export default Browser;
