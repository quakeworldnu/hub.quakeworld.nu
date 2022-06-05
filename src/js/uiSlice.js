import storage from "./util/storage.js";
import { createSlice } from "@reduxjs/toolkit";

const getDefaultUiState = () => ({
  favorites: {
    servers: [],
  },
  filters: {
    query: "",
    isFavorite: false,
    isStarted: false,
    region: "",
  },
});

const getInitialState = () =>
  Object.assign({}, getDefaultUiState(), storage.load());

export const uiSlice = createSlice({
  name: "ui",
  initialState: getInitialState(),
  reducers: {
    updateFilters: (state, action) => {
      const { values } = action.payload;
      state.filters = values;

      storage.save(state);
    },
    toggleFavoriteServer: (state, action) => {
      const { serverAddress } = action.payload;

      const index = state.favorites.servers.indexOf(serverAddress);
      const isFavorite = index !== -1;

      if (isFavorite) {
        state.favorites.servers.splice(index, 1);
      } else {
        state.favorites.servers.push(serverAddress);
      }

      storage.save(state);
    },
  },
});

export const { updateFilters, toggleFavoriteServer } = uiSlice.actions;

export const selectUi = (state) => state.ui;

export default uiSlice;
