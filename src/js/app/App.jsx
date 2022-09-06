import React from "react";
import store from "./store.js";
import { eventsSlice } from "../services/qws/events.js";
import { newsSlice } from "../services/qws/news.js";
import { serversSlice } from "../services/qws/servers.js";
import { streamsSlice } from "../services/qws/streams.js";
import ServerOverview from "../servers/Overview.jsx";
import Events from "../Events.jsx";
import News from "../News.jsx";
import Streams from "../Streams.jsx";
import Servers from "../servers/Servers.jsx";

const AppHeader = () => {
  return (
    <div className="my-3 animation-fade-in-down">
      <div className="columns is-mobile is-vcentered is-multiline">
        <div className="column is-narrow">
          <a href="/" className="is-flex" id="app-logo-link">
            <img src="/assets/img/qtvlogo.svg" width="82" height="59" />
          </a>
        </div>
        <div className="column is-8-mobile is-9-tablet is-10-desktop is-10-widescreen is-narrow-fullhd">
          <ServerOverview />
        </div>
        <div className="column">
          <Streams />
        </div>
      </div>
    </div>
  );
};

const AppFooter = () => {
  return (
    <div className="has-text-dark columns is-gapless">
      <div className="mb-3">
        <a href="https://www.quakeworld.nu/">QuakeWorld.nu</a><span className="px-1"> • </span>
        <a href="https://discord.quake.world/">Discord</a><span className="px-1"> • </span>
        <a href="https://www.twitch.tv/quakeworld/">Twitch</a><span className="px-1"> • </span>
        <a href="https://www.quakeworld.nu/wiki/Overview/">Wiki</a>
      </div>
      <div className="ml-auto">
        <a href="https://github.com/vikpe/qw-hub">View on GitHub</a>
      </div>
    </div>
  )
}

function startPollingDataSources() {
  store.dispatch(
    streamsSlice.endpoints.getStreams.initiate(
      {},
      { subscriptionOptions: { pollingInterval: 15500 } }
    )
  );

  store.dispatch(
    serversSlice.endpoints.getMvdsv.initiate(
      {},
      { subscriptionOptions: { pollingInterval: 5000 } }
    )
  );

  store.dispatch(eventsSlice.endpoints.getEvents.initiate({}, { subscriptionOptions: { pollingInterval: 900 } }));
  store.dispatch(newsSlice.endpoints.getNews.initiate({}, { subscriptionOptions: { pollingInterval: 900 } }));
}

export const App = () => {
  startPollingDataSources();

  return (
    <>
      <AppHeader />
      <Servers />
      <div className="animation-fade-in-delayed">
        <hr className="my-6" />
        <div className="columns is-desktop">
          <div className="column">
            <News />
          </div>
          <Events />
        </div>
        <hr />
        <AppFooter />
      </div>
    </>
  );
};

export default App;
