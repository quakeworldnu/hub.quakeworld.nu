import storage from "../../common/storage";
import { createSlice } from "@reduxjs/toolkit";
import { metaByServer } from "../../common/serverMeta";
import { compareServers } from "../../common/sort";

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
  streams: [],
});

const newStream = (player, channel, title) => ({
  player,
  channel,
  title,
  url: `https://www.twitch.tv/${channel}`,
});

const playerToStream = {
  "twitch.tv/vikpe": "vikpe",
  "badsebitv/twich": "badsebitv",
  "Milton": "miltonizer",
}

const serverHasClient = (server, clientName) => {
  let spectator = server.SpectatorNames.includes(clientName);
  let qtvstream = server.QtvStream.SpectatorNames.includes(clientName);
  let players = server.Players.map(p => p.Name).includes(clientName);

  return (
    spectator ||
    qtvstream ||
    players
  );
}

export default createSlice({
  name: "form",
  initialState: getInitialState(),
  reducers: {
    updateStreams: (state, action) => {
      let { streams } = action.payload;
      state.streams = streams;
    },
    updateServers: (state, action) => {
      let { servers } = action.payload;

      // ignore [ServeMe]
      for (let i = 0; i < servers.length; i++) {
        const index = servers[i].SpectatorNames.indexOf("[ServeMe]");

        if (index !== -1) {
          servers[i].SpectatorNames.splice(index, 1);
          servers[i].SpectatorSlots.Used--;
        }
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
