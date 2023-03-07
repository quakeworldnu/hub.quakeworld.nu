import { hubApi } from "./hub.js";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const streamsAdapter = createEntityAdapter({
  selectId: (stream) => stream.channel,
  sortComparer: (a, b) => a.channel.localeCompare(b.channel),
});

const initialState = streamsAdapter.getInitialState();

export const streamsSlice = hubApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getStreams: builder.query({
      query: () => "streams",
      transformResponse: (responseData) => {
        return streamsAdapter.setAll(initialState, responseData);
      },
    }),
  }),
});

const selectStreamsResult = streamsSlice.endpoints.getStreams.select({});
const selectStreamsData = createSelector(
  selectStreamsResult,
  (result) => result.data
);

const entitySelectors = streamsAdapter.getSelectors(
  (state) => selectStreamsData(state) ?? initialState
);

export const {
  selectById: selectStreamByChannel,
  selectIds: selectStreamChannels,
} = entitySelectors;

export const selectStreamsByServerAddress = createSelector(
  [entitySelectors.selectAll, (state, serverAddress) => serverAddress],
  (streams, serverAddress) =>
    streams.filter((stream) => stream.server_address === serverAddress)
);
