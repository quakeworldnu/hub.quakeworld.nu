import { compareServers } from "@qwhub/services/hub/serverSort";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { transformDemos } from "./demoTransform";
import { transformServer } from "./serverTransform";

export const hubApi = createApi({
  reducerPath: "hub",
  baseQuery: fetchBaseQuery({ baseUrl: "https://hubapi.quakeworld.nu/v2/" }),
  endpoints: (build) => ({
    getDemos: build.query({
      query: () => "demos",
      transformResponse: transformDemos,
    }),
    getEvents: build.query({ query: () => "events" }),
    getForumPosts: build.query({ query: () => "forum_posts" }),
    getGamesInSpotlight: build.query({ query: () => "games_in_spotlight" }),
    getNews: build.query({ query: () => "news" }),
    getServer: build.query({
      query: (address) => `servers/${address}`,
      transformResponse: (server) => transformServer(server),
    }),
    getServers: build.query({
      query: (query = "") =>
        query ? `servers/mvdsv?${query}` : "servers/mvdsv",
      transformResponse: (servers) => {
        servers = servers.map(transformServer);
        servers.sort(compareServers);
        return servers;
      },
    }),
    getStreams: build.query({
      query: () => "streams",
      transformResponse: (servers) => {
        servers.sort((a, b) => b.viewers - a.viewers);
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
    getWikiRecentChanges: build.query({
      query: () => "wiki_recent_changes",
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
  useGetWikiRecentChangesQuery,
} = hubApi;
