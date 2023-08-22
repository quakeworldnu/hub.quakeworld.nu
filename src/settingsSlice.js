import { createSlice } from "@reduxjs/toolkit";
import { localStorageGet, localStorageSet } from "@qwhub/util";

export const gameModes = [
  "1on1",
  "2on2",
  "4on4",
  "ffa",
  "racing",
  "fortress",
  "other",
];

export function getDefaultServerFilters() {
  const defaultValues = {
    only_bots: true,
    modes: [...gameModes],
  };
  return Object.assign({}, defaultValues);
}

function getInitialServerFilters() {
  return Object.assign(
    {},
    getDefaultServerFilters(),
    localStorageGet("serverFilters", {}),
  );
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    ui: {
      showSettings: false,
    },
    serverFilters: getInitialServerFilters(),
  },
  reducers: {
    toggleShowSettings: (state) => {
      state.ui.showSettings = !state.ui.showSettings;
    },
    setShowSettings: (state, { payload }) => {
      state.ui.showSettings = payload;
    },
    setServerFilters: (state, { payload }) => {
      localStorageSet("serverFilters", Object.assign({}, payload));
      state.serverFilters = payload;
    },
  },
});

export const { setServerFilters, setShowSettings, toggleShowSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;

//
