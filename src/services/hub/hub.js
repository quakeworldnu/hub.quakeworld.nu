import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hubApi = createApi({
  reducerPath: "hub",
  baseQuery: fetchBaseQuery({ baseUrl: "https://hubapi.quakeworld.nu/v2/" }),
  endpoints: (build) => ({
    getEvents: build.query({ query: () => "events", }),
    getForumPosts: build.query({ query: () => "forum_posts", }),
    getNews: build.query({ query: () => "news", }),
    getStreams: build.query({ query: () => "streams", }),
  }),
});

export const {
  useGetEventsQuery,
  useGetForumPostsQuery,
  useGetNewsQuery,
  useGetStreamsQuery,
} = hubApi
