import { qwsSlice } from "./hub.js";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const eventsAdapter = createEntityAdapter({
  selectId: (event) => event.title,
});
const initialState = eventsAdapter.getInitialState();

export const eventsSlice = qwsSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => "events",
      transformResponse: (responseData) => {
        return eventsAdapter.setAll(initialState, responseData);
      },
    }),
  }),
});

const selectEventsResult = eventsSlice.endpoints.getEvents.select({});
const selectEventsData = createSelector(
  selectEventsResult,
  (result) => result.data
);

export const { selectAll: selectAllEvents } = eventsAdapter.getSelectors(
  (state) => selectEventsData(state) ?? initialState
);
