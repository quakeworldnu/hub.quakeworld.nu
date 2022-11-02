import { qwsSlice } from "./hub.js";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const newsAdapter = createEntityAdapter({
  selectId: (item) => item.title,
});
const initialState = newsAdapter.getInitialState();

export const newsSlice = qwsSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getNews: builder.query({
      query: () => "news",
      transformResponse: (responseData) => {
        return newsAdapter.setAll(initialState, responseData);
      },
    }),
  }),
});

const selectNewsResult = newsSlice.endpoints.getNews.select({});
const selectNewsData = createSelector(
  selectNewsResult,
  (result) => result.data
);

export const { selectAll: selectAllNews } = newsAdapter.getSelectors(
  (state) => selectNewsData(state) ?? initialState
);
