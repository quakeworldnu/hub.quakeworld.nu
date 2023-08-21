import { configureStore } from "@reduxjs/toolkit";
//import { setupListeners } from '@reduxjs/toolkit/query'
import { hubApi } from "./services/hub/hub.js";
import settingsReducer from "@qwhub/settingsSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,

    // Add the generated reducer as a specific top-level slice
    [hubApi.reducerPath]: hubApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(hubApi.middleware),
});
export default store;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
//setupListeners(store.dispatch)
