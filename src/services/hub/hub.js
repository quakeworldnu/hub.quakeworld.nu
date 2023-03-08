import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hubApi = createApi({
  reducerPath: "hub",
  baseQuery: fetchBaseQuery({ baseUrl: "https://hubapi.quakeworld.nu/v2/" }),
  endpoints: (build) => ({
    getEvents: build.query({ query: () => "events", }),
    getForumPosts: build.query({ query: () => "forum_posts", }),
    getNews: build.query({ query: () => "news", }),
  }),
});

export const {
  useGetEventsQuery,
  useGetForumPostsQuery,
  useGetNewsQuery,
} = hubApi
