import React from "react";
import store from "@/store";
import { eventsSlice } from "@/services/hub/events";
import { newsSlice } from "@/services/hub/news";
import { serversSlice } from "@/services/hub/servers";
import { streamsSlice } from "@/services/hub/streams";
import { forumPostsSlice } from "@/services/hub/forumPosts";
import Servers from "@/servers/Servers";
import { SiteFooter } from "@/site/Footer";
import { SiteHeader } from "@/site/Header";

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
      <SiteHeader />
      <Servers />
      <SiteFooter />
    </>
  );
};

export default App;
