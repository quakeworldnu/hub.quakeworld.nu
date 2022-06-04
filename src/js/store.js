import { configureStore } from "@reduxjs/toolkit";
//import { setupListeners } from '@reduxjs/toolkit/query'
import { qwsApi } from "./services/qws";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [qwsApi.reducerPath]: qwsApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(qwsApi.middleware),
});
export default store;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
//setupListeners(store.dispatch)
