import { createSlice } from "@reduxjs/toolkit";
import { localStorageSet } from "@qwhub/util";
import { getInitialServerFilters } from "@qwhub/serverFilters";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    ui: {
      showSettings: false,
    },
    serverFilters: getInitialServerFilters(),
  },
  reducers: {
    setShowSettings: (state, { payload }) => {
      state.ui.showSettings = payload;
    },
    setServerFilters: (state, { payload }) => {
      localStorageSet("serverFilters", Object.assign({}, payload));
      state.serverFilters = payload;
    },
  },
});

export const { setServerFilters, setShowSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
