import {
  type ServerFilters,
  getInitialServerFilters,
} from "@qwhub/serverFilters";
import { localStorageSet } from "@qwhub/util";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export type SettingsState = {
  ui: {
    showSettings: boolean;
  };
  serverFilters: ServerFilters;
};

const initialState: SettingsState = {
  ui: {
    showSettings: false,
  },
  serverFilters: getInitialServerFilters(),
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setShowSettings: (state, { payload }: PayloadAction<boolean>) => {
      state.ui.showSettings = payload;
    },
    setServerFilters: (state, { payload }: PayloadAction<ServerFilters>) => {
      localStorageSet("serverFilters", Object.assign({}, payload));
      state.serverFilters = payload;
    },
  },
});

export const { setServerFilters, setShowSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
