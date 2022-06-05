import { qwsSlice } from "./qws.js";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

import { metaByServer } from "../../util/serverMeta.js";
import { compareServers } from "../../util/sort.js";

const serversAdapter = createEntityAdapter({
  selectId: (server) => server.Address,
});

const initialState = serversAdapter.getInitialState();

// Define a service using a base URL and expected endpoints
export const serversSlice = qwsSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMvdsv: builder.query({
      query: () => "mvdsv",
      transformResponse: (responseData) => {
        console.log("serversSlice.transformResponse");
        const servers = responseData;

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

        return serversAdapter.setAll(initialState, servers);
      },
    }),
  }),
});

export const selectserversResult = serversSlice.endpoints.getMvdsv.select({});
export const selectserversData = createSelector(
  selectserversResult,
  (result) => result.data
);

export const { selectAll: selectAllServers, selectById: selectServerById } =
  serversAdapter.getSelectors(
    (state) => selectserversData(state) ?? initialState
  );
