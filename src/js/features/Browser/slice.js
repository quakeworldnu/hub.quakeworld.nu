import { createSlice } from "@reduxjs/toolkit";

import servers from "../../data/busy.json";

const getInitialState = () => ({
  ui: {
    favorites: {
      players: [],
      servers: [],
    },
    filters: {},
  },
  entries: servers,
});

export default createSlice({
  name: "form",
  initialState: getInitialState(),
  reducers: {
    /*
    add: (state) => {

      const lastEntry = Object.values(state).pop();
      const newId = parseInt(lastEntry.id) + 1;

      state[newId] = {
        ...deepCopy(lastEntry),
        id: newId,
      };
    },
    update: (state, action) => {
      const { id, values } = action.payload;

      state[id].values = values;
      state[id].result = {};
    },
    remove: (state, action) => {
      const { id } = action.payload;
      delete state[id];
    },
     */
  },
});
