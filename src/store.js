import settingsReducer from "@qwhub/settingsSlice";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { qworldApi } from "./services/qworld/api.js";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,

    // Add the generated reducer as a specific top-level slice
    [qworldApi.reducerPath]: qworldApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(qworldApi.middleware),
});
export default store;

// tracks page visibility, required for skipPollingIfUnfocused/refetchOnFocus
setupListeners(store.dispatch);
