import { qwsSlice } from "./qws.js";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { metaByServer } from "./serverMeta.js";
import { filterServers } from "./serverFilters.js";
import { selectUi } from "./../../uiSlice.js";

const serversAdapter = createEntityAdapter({
  selectId: (server) => server.Address,
  sortComparer: (a, b) => {
    if (a.meta.score > b.meta.score) {
      return -1;
    } else if (a.meta.score < b.meta.score) {
      return 1;
    }

    // player slots
    if (a.PlayerSlots.Free < b.PlayerSlots.Free) {
      return -1;
    } else if (a.PlayerSlots.Free > b.PlayerSlots.Free) {
      return 1;
    }

    // Address
    if (a.Address < b.Address) {
      return -1;
    } else if (a.Address > b.Address) {
      return 1;
    }

    return 0;
  },
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

        return serversAdapter.setAll(initialState, servers);
      },
    }),
  }),
});

export const selectServersResult = serversSlice.endpoints.getMvdsv.select({});
export const selectServersData = createSelector(
  [selectServersResult],
  (result) => result.data
);

export const { selectAll: selectAllServers, selectById: selectServerById } =
  serversAdapter.getSelectors(
    (state) => selectServersData(state) ?? initialState
  );

export const selectFilteredServers = createSelector(
  [selectAllServers, selectUi],
  (servers, ui) => filterServers(servers, ui.filters, ui.favorites.servers)
);
