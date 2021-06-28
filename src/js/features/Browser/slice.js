import { createSlice } from "@reduxjs/toolkit";
import {
  compareServers,
  isBot,
  metaByServer,
  sortByProp,
} from "../../common/util";
import storage from "../../common/storage";
import countryCodeByIp from "../../common/countryCodeByIp";

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

const filterServers = (servers) => {
  // ignore bots that are spectators
  for (let i = 0; i < servers.length; i++) {
    servers[i].Players = servers[i].Players.filter(
      (p) => !(p.Spec && isBot(p))
    );
  }

  // ignore servers without clients
  servers = servers.filter((s) => s.Players.length > 0);

  return servers;
};

const sortPlayers = (players) => {
  players.sort(sortByProp("Team", "ASC"));
  players.sort(sortByProp("Frags", "DESC"));
};

export default createSlice({
  name: "form",
  initialState: getInitialState(),
  reducers: {
    updateServers: (state, action) => {
      let { servers } = action.payload;

      // filter
      servers = filterServers(servers);

      // add missing country data
      for (let i = 0; i < servers.length; i++) {
        if ("" === servers[i].Country) {
          const hostname = servers[i].Address.split(":")[0];

          if (hostname in countryCodeByIp) {
            servers[i].Country = countryCodeByIp[hostname];
          }
        }
      }

      // add meta
      for (let i = 0; i < servers.length; i++) {
        servers[i].meta = metaByServer(servers[i]);
      }

      // sort
      for (let i = 0; i < servers.length; i++) {
        sortPlayers(servers[i].Players);
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
