import { qwsSlice } from "./hub.js";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const forumPostsAdapter = createEntityAdapter({
  selectId: (item) => item.title,
});
const initialState = forumPostsAdapter.getInitialState();

export const forumPostsSlice = qwsSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getForumPosts: builder.query({
      query: () => "forum_posts",
      transformResponse: (responseData) => {
        return forumPostsAdapter.setAll(initialState, responseData);
      },
    }),
  }),
});

const selectForumPostsResult = forumPostsSlice.endpoints.getForumPosts.select(
  {}
);
const selectForumPostsData = createSelector(
  selectForumPostsResult,
  (result) => result.data
);

export const { selectAll: selectAllForumPosts } =
  forumPostsAdapter.getSelectors(
    (state) => selectForumPostsData(state) ?? initialState
  );
