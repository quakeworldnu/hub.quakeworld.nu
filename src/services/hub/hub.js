import { compareServers } from "@qwhub/services/hub/serverSort";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { transformServer } from "./serverTransform";

export const hubApi = createApi({
  reducerPath: "hub",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.quake.world/v1/" }),
  endpoints: (build) => ({
    getServer: build.query({
      query: (address) => `servers/${address}`,
      transformResponse: (server) => transformServer(server),
    }),
    getServers: build.query({
      query: (query = "") => {
        const base = "servers?server_type=game_server&with_clients=true";
        return query ? `${base}&${query}` : base;
      },
      transformResponse: (servers) => {
        const servers_ = servers.map(transformServer);
        servers_.sort(compareServers);
        return servers_.filter((s) => s.players.length > 0);
      },
    }),
    getStreams: build.query({
      query: () => "vendor/twitch-streams",
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
  }),
});

export const {
  useGetServerQuery,
  useGetServersQuery,
  useGetStreamsQuery,
  useGetLastscoresQuery,
} = hubApi;
