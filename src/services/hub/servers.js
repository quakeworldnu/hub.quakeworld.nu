import { hubSlice } from "./hub.js";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { transformServerData } from "./serverTransforms.js";
import { compareServers } from "./serverSort.js";

const serversAdapter = createEntityAdapter({
  selectId: (server) => server.address,
  sortComparer: compareServers,
});
const initialState = serversAdapter.getInitialState();

// Define a service using a base URL and expected endpoints
export const serversSlice = hubSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMvdsv: builder.query({
      query: () => "servers/mvdsv",
      transformResponse: (responseData) => {
        return serversAdapter.setAll(
          initialState,
          responseData.map(transformServerData)
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

const entitySelectors = serversAdapter.getSelectors(
  (state) => selectServersData(state) ?? initialState
);

export const {
  selectAll: selectAllServers,
  selectById: selectServerByAddress,
  selectIds: selectAllServerAddresses,
} = entitySelectors;

const createSelectorFuncByProp = (prop, defaultValue = null) =>
  createSelector(
    [(state) => state, (state, address) => address],
    (state, address) => {
      const server = entitySelectors.selectById(state, address);
      return server.hasOwnProperty(prop) ? server[prop] : defaultValue;
    }
  );

export const selectPlayersByAddress = createSelectorFuncByProp("players");
export const selectTeamsByAddress = createSelectorFuncByProp("teams");
export const selectMetaByAddress = createSelectorFuncByProp("meta");
