import { createSlice } from "@reduxjs/toolkit";
import { metaByServer, compareServers, sortByProp } from "../../common/util";
import storage from "../../common/storage";
import { serverCountries } from "./serverCountries";

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
      const { servers } = action.payload;

      // assign missing country data
      for (let i = 0; i < servers.length; i++) {
        if ("" === servers[i].Country) {
          const hostname = servers[i].Address.split(":")[0];

          if (hostname in serverCountries) {
            servers[i].Country = serverCountries[hostname];
            console.log(servers[i]);
          }
        }
      }

      // ignore bots
      for (let i = 0; i < servers.length; i++) {
        servers[i].Players = servers[i].Players.filter(
          (p) => !(p.Spec && p.IsBot)
        );
      }

      // sort players
      for (let i = 0; i < servers.length; i++) {
        servers[i].Players.sort(sortByProp("Team", "ASC"));
        servers[i].Players.sort(sortByProp("Frags", "DESC"));
      }

      // meta
      for (let i = 0; i < servers.length; i++) {
        servers[i].meta = metaByServer(servers[i]);
      }

      // sort servers
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
