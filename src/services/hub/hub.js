import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { transformServerData } from "@/services/hub/serverTransforms";
import { compareServers } from "@/services/hub/serverSort";

export const hubApi = createApi({
  reducerPath: "hub",
  baseQuery: fetchBaseQuery({ baseUrl: "https://hubapi.quakeworld.nu/v2/" }),
  endpoints: (build) => ({
    getDemos: build.query({ query: () => "demos" }),
    getEvents: build.query({ query: () => "events" }),
    getForumPosts: build.query({ query: () => "forum_posts" }),
    getGamesInSpotlight: build.query({ query: () => "games_in_spotlight" }),
    getNews: build.query({ query: () => "news" }),
    getServer: build.query({
      query: (address) => `servers/${address}`,
      transformResponse: (server) => transformServer(server),
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
    getLastscores: build.query({
      query: (address) => `servers/${address}/lastscores`,
      transformResponse: (lastscores) => {
        lastscores.reverse();
        return lastscores.filter((e) => e.teams.length + e.players.length > 0);
      },
    }),
  }),
});

export const {
  useGetDemosQuery,
  useGetEventsQuery,
  useGetForumPostsQuery,
  useGetGamesInSpotlightQuery,
  useGetNewsQuery,
  useGetServerQuery,
  useGetServersQuery,
  useGetStreamsQuery,
  useGetLastscoresQuery,
} = hubApi;
