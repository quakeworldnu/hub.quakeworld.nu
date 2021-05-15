import { combineReducers, configureStore } from "@reduxjs/toolkit";
import formSlice from "./slice";

export const createStore = () => {
  const reducer = combineReducers({ browser: formSlice.reducer });
  return configureStore({ reducer });
};

export default createStore();
