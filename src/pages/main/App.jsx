import React from "react";
import store from "../../app/store.js";
import { eventsSlice } from "../../services/hub/events.js";
import { newsSlice } from "../../services/hub/news.js";
import { serversSlice } from "../../services/hub/servers.js";
import { streamsSlice } from "../../services/hub/streams.js";
import { forumPostsSlice } from "../../services/hub/forumPosts.js";
import Servers from "../../servers/Servers.jsx";
import { AppFooter } from "../../app/Footer";
import { AppHeader } from "../../app/Header";

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
