import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchGeo } from "./geo";
import { toLastscores } from "./lastscores";
import { isGameServer, toServer } from "./server";
import { compareServers } from "./serverSort";

export const qworldApi = createApi({
  reducerPath: "qworld",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.quake.world/v1/" }),
  endpoints: (build) => ({
    getServer: build.query({
      queryFn: async (address, _api, _extraOptions, baseQuery) => {
        const [result, geo] = await Promise.all([
          baseQuery(`servers/${address}`),
          fetchGeo(),
        ]);

        if (result.error) {
          return { error: result.error };
        }

        if (!isGameServer(result.data)) {
          return { error: { status: 404, data: "not a game server" } };
        }

        return { data: toServer(result.data, geo) };
      },
    }),
    getServers: build.query({
      queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
        const [result, geo] = await Promise.all([
          baseQuery("servers?server_type=game&min_clients=1"),
          fetchGeo(),
        ]);

        if (result.error) {
          return { error: result.error };
        }

        const servers = result.data
          .map((s) => toServer(s, geo))
          .filter((s) => s.players.length + s.spectators.length > 0);
        servers.sort(compareServers);
        return { data: servers };
      },
    }),
    getTwitchStreams: build.query({
      query: () => "vendor/twitch-streams",
      transformResponse: (response) => {
        const streams = response.data;
        streams.sort((a, b) => b.viewer_count - a.viewer_count);
        return streams;
      },
    }),
    getLastscores: build.query({
      query: (address) => `servers/${address}/lastscores`,
      transformResponse: (entries, _meta, address) =>
        toLastscores(entries, address),
    }),
  }),
});

export const {
  useGetServerQuery,
  useGetServersQuery,
  useGetTwitchStreamsQuery,
  useGetLastscoresQuery,
} = qworldApi;
