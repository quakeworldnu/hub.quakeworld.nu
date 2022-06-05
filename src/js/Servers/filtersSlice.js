import storage from "../util/storage.js";
import { createSlice } from "@reduxjs/toolkit";

const getDefaultState = () => ({
  favoriteServers: [],
  query: "",
  isFavorite: false,
  isStarted: false,
  region: "",
});

const sliceName = "filters";

const getInitialState = () =>
  Object.assign({}, getDefaultState(), storage.load(sliceName));

const saveToStorage = (values) => storage.save(sliceName, values);

export const filtersSlice = createSlice({
  name: sliceName,
  initialState: getInitialState(),
  reducers: {
    updateFilters: (state, action) => {
      const { values } = action.payload;
      saveToStorage(values);
      return values;
    },
    toggleFavoriteServer: (state, action) => {
      const { serverAddress } = action.payload;

      const favoriteServers = [...state.favoriteServers];
      const index = favoriteServers.indexOf(serverAddress);
      const isFavorite = index !== -1;

      if (isFavorite) {
        favoriteServers.splice(index, 1);
      } else {
        favoriteServers.push(serverAddress);
      }

      return {
        ...state,
        favoriteServers,
      };
    },
  },
});

export const { updateFilters, toggleFavoriteServer } = filtersSlice.actions;

export default filtersSlice;
