import { qwsSlice } from "./qws.js";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { transformResponseData } from "./serverTransforms.js";
import { filterServers } from "./serverFilters.js";
import { compareServers } from "./serverSort.js";

const serversAdapter = createEntityAdapter({
  selectId: (server) => server.address,
  sortComparer: compareServers,
});
const initialState = serversAdapter.getInitialState();

// Define a service using a base URL and expected endpoints
export const serversSlice = qwsSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMvdsv: builder.query({
      query: () => "mvdsv",
      transformResponse: (responseData) => {
        return serversAdapter.setAll(
          initialState,
          transformResponseData(responseData)
        );
      },
    }),
  }),
});

const selectServersResult = serversSlice.endpoints.getMvdsv.select({});
const selectServersData = createSelector(
  [selectServersResult],
  (result) => result.data
);

export const { selectAll: selectAllServers, selectById: selectServerById } =
  serversAdapter.getSelectors(
    (state) => selectServersData(state) ?? initialState
  );

export const selectFilteredServers = createSelector(
  [selectAllServers, (state) => state.filters],
  (servers, filters) => filterServers(servers, filters)
);
