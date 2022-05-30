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
});

const newStream = (player, channel, title) => ({
  player,
  channel,
  title,
  url: `https://www.twitch.tv/${channel}`,
});

let twitchStreams = [
  newStream("twitch.tv/vikpe", "vikpe"),
  //newStream("bps", "bps__"),
  //newStream("suddendeathTV", "suddendeathTV"),
];

export default createSlice({
  name: "form",
  initialState: getInitialState(),
  reducers: {
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

      // twitch streams
      for (let i = 0; i < servers.length; i++) {
        let serverStreams = [];

        twitchStreams.forEach((stream) => {
          if (
            servers[i].SpectatorNames.includes(stream.player) ||
            servers[i].QtvStream.SpectatorNames.includes(stream.player)
          ) {
            serverStreams = serverStreams.concat(
              newStream(stream.player, stream.channel, servers[i].Title)
            );
          }
        });

        servers[i].streams = serverStreams;
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
