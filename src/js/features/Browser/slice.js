import { createSlice } from "@reduxjs/toolkit";
import { metaByServer, compareServers } from "../../common/util";

const getInitialState = () => ({
  ui: {
    favorites: {
      servers: [],
    },
    filters: {
      keyword: "",
      isFavorite: false,
    },
  },
  servers: [],
});

export default createSlice({
  name: "form",
  initialState: getInitialState(),
  reducers: {
    updateServers: (state, action) => {
      const { servers } = action.payload;

      for (let i = 0; i < servers.length; i++) {
        servers[i].meta = metaByServer(servers[i]);
      }

      servers.sort(compareServers);

      state.servers = servers;
    },
    updateFilters: (state, action) => {
      const { values } = action.payload;
      state.ui.filters = values;
    },
    toggleFavoriteServer: (state, action) => {
      const { serverAddress } = action.payload;

      const index = state.ui.favorites.servers.indexOf(serverAddress);
      const isFavorite = index !== -1;

      if (isFavorite) {
        state.ui.favorites.servers.splice(index, 1);
      } else {
        state.ui.favorites.servers.push(serverAddress);
      }
    },
  },
});
