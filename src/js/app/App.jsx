import React from "react";
import store from "./store.js";
import { eventsSlice } from "../services/qws/events.js";
import { newsSlice } from "../services/qws/news.js";
import { serversSlice } from "../services/qws/servers.js";
import { streamsSlice } from "../services/qws/streams.js";
import { forumPostsSlice } from "../services/qws/forumPosts.js";
import Servers from "../servers/Servers.jsx";
import { AppFooter } from "./Footer";
import { AppHeader } from "./Header";

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

  const MINUTE = 1000 * 60;
  const scrapeOptions = {
    subscriptionOptions: { pollingInterval: 15 * MINUTE },
  };
  store.dispatch(eventsSlice.endpoints.getEvents.initiate({}, scrapeOptions));
  store.dispatch(newsSlice.endpoints.getNews.initiate({}, scrapeOptions));
  store.dispatch(
    forumPostsSlice.endpoints.getForumPosts.initiate({}, scrapeOptions)
  );
}

export const App = () => {
  startPollingDataSources();

  return (
    <>
      <AppHeader />
      <Servers />
      <AppFooter />
    </>
  );
};

export default App;
