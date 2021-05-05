import { combineReducers, configureStore } from "@reduxjs/toolkit";
import formSlice from "./slice";

export const createStore = () => {
  const reducer = combineReducers({ servers: formSlice.reducer });
  return configureStore({ reducer });
};

export default createStore();
