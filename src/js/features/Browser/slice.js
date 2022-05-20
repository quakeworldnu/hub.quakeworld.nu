import storage from "../../common/storage";
import { createSlice } from "@reduxjs/toolkit";
import { metaByServer } from "../../common/serverMeta";
import { compareServers, sortByProp } from "../../common/sort";

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

const getInitialState = () => ({
  ui: Object.assign({}, getDefaultUiState(), storage.load()),
  servers: [],
});

export default createSlice({
  name: "form",
  initialState: getInitialState(),
  reducers: {
    updateServers: (state, action) => {
      let { servers } = action.payload;

      // ignore servers without clients
      servers = servers.filter(
        (s) => s.PlayerSlots.Used + s.SpectatorSlots.Used > 0
      );

      // sort
      for (let i = 0; i < servers.length; i++) {
        servers[i].Teams.sort(sortByProp("Name", "ASC"));
        servers[i].Players.sort(sortByProp("Team", "ASC"));
      }

      // add meta data
      for (let i = 0; i < servers.length; i++) {
        servers[i].meta = metaByServer(servers[i]);
      }

      servers.sort(compareServers);

      state.servers = servers;
    },
    updateFilters: (state, action) => {
      const { values } = action.payload;
      state.ui.filters = values;

      storage.save(state.ui);
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

      storage.save(state.ui);
    },
  },
});
