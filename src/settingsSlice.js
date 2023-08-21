import { createSlice } from "@reduxjs/toolkit";

export const gameModes = [
  "1on1",
  "2on2",
  "4on4",
  "FFA",
  "Racing",
  "Fortress",
  "Other",
];

export function getDefaultServerFilters() {
  return Object.assign(
    {},
    {
      only_bots: true,
      modes: [...gameModes],
    },
  );
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    ui: {
      showSettings: false,
    },
    serverFilters: getDefaultServerFilters(),
  },
  reducers: {
    toggleShowSettings: (state) => {
      state.ui.showSettings = !state.ui.showSettings;
    },
    setShowSettings: (state, { payload }) => {
      state.ui.showSettings = payload;
    },
    resetServerFilters: (state) => {
      state.serverFilters = getDefaultServerFilters();
    },
    setServerFilters: (state, { payload }) => {
      state.serverFilters = payload;
    },
  },
});

export const {
  setServerFilters,
  resetServerFilters,
  setShowSettings,
  toggleShowSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;

//
