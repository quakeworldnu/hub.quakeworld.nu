import storage from "../../common/storage";
import { countryCodeByHostname } from "../../common/geo_ip";
import { createSlice } from "@reduxjs/toolkit";
import { metaByServer } from "../../common/serverMeta";
import { compareServers, sortByProp } from "../../common/sort";
import { ignoreSpectatingBots } from "../../common/filter";

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

      // filter data
      for (let i = 0; i < servers.length; i++) {
        servers[i].Players = ignoreSpectatingBots(servers[i].Players);
      }

      // ignore servers without clients
      servers = servers.filter((s) => s.Players.length > 0);

      // add missing country data
      for (let i = 0; i < servers.length; i++) {
        if ("" === servers[i].Country) {
          const hostname = servers[i].Address.split(":")[0];
          servers[i].Country = countryCodeByHostname(hostname);
        }
      }

      // sort
      for (let i = 0; i < servers.length; i++) {
        servers[i].Players.sort(sortByProp("Team", "ASC"));
        servers[i].Players.sort(sortByProp("Frags", "DESC"));
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
