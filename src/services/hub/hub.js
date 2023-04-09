import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { transformServerData } from "@/services/hub/serverTransforms";
import { compareServers } from "@/services/hub/serverSort";

export const hubApi = createApi({
  reducerPath: "hub",
  baseQuery: fetchBaseQuery({ baseUrl: "https://hubapi.quakeworld.nu/v2/" }),
  endpoints: (build) => ({
    getEvents: build.query({ query: () => "events" }),
    getForumPosts: build.query({ query: () => "forum_posts" }),
    getNews: build.query({ query: () => "news" }),
    getServer: build.query({
      query: (address) => `servers/${address}`,
      transformResponse: (server) => transformServerData(server),
    }),
    getServers: build.query({
      query: () => "servers/mvdsv",
      transformResponse: (servers) => {
        servers = servers.map(transformServerData);
        servers.sort(compareServers);
        return servers;
      },
    }),
    getStreams: build.query({
      query: () => "streams",
      transformResponse: (servers) => {
        servers.sort((a, b) => a.channel.localeCompare(b.channel));
        return servers;
      },
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetForumPostsQuery,
  useGetNewsQuery,
  useGetServerQuery,
  useGetServersQuery,
  useGetStreamsQuery,
} = hubApi;
