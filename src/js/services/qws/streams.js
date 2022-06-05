import { qwsSlice } from "./qws.js";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const streamsAdapter = createEntityAdapter({
  selectId: (stream) => stream.channel,
});

const initialState = streamsAdapter.getInitialState();

export const streamsSlice = qwsSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getStreams: builder.query({
      query: () => "streams",
      transformResponse: (responseData) => {
        console.log("streamsSlice.transformResponse");
        return streamsAdapter.setAll(initialState, responseData);
      },
    }),
  }),
});

export const selectStreamsResult = streamsSlice.endpoints.getStreams.select({});
export const selectStreamsData = createSelector(
  selectStreamsResult,
  (result) => result.data
);

export const { selectAll: selectAllStreams, selectById: selectStreamById } =
  streamsAdapter.getSelectors(
    (state) => selectStreamsData(state) ?? initialState
  );
