import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => ({
  ui: {
    favorites: {
      players: [],
      servers: [],
    },
    filters: {},
  },
  entries: [],
});

export default createSlice({
  name: "form",
  initialState: getInitialState(),
  reducers: {
    updateEntries: (state, action) => {
      const { entries } = action.payload;
      state.entries = entries;
    },
  },
});
