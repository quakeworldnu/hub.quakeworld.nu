import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { metaByServer } from "../common/serverMeta.js";
import { compareServers } from "../common/sort.js";

const paramsToString = (params) =>
  Object.keys(params).lengt > 0
    ? `?${new URLSearchParams(params).toString()}`
    : "";

// Define a service using a base URL and expected endpoints
export const qwsSlice = createApi({
  reducerPath: "qws",
  baseQuery: fetchBaseQuery({ baseUrl: "https://metaqtv.quake.se/v2/" }),
  endpoints: (builder) => ({
    getMvdsv: builder.query({
      query: (params) => "mvdsv" + paramsToString(params),
      transformResponse: (response) => {
        const servers = response;

        // ignore [ServeMe]
        for (let i = 0; i < servers.length; i++) {
          const index = servers[i].SpectatorNames.indexOf("[ServeMe]");

          if (index !== -1) {
            servers[i].SpectatorNames.splice(index, 1);
            servers[i].SpectatorSlots.Used--;
          }
        }

        // add meta data
        for (let i = 0; i < servers.length; i++) {
          servers[i].meta = metaByServer(servers[i]);
        }

        servers.sort(compareServers);

        return servers;
      },
    }),
    getStreams: builder.query({
      query: (params) => "streams" + paramsToString(params),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetMvdsvQuery, useGetStreamsQuery } = qwsSlice;
