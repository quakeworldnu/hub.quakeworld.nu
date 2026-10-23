import store from "@qwhub/store";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "@qwhub/styles/index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  /*<React.StrictMode>*/
  <Provider store={store}>
    <App />
  </Provider>,
  /*</React.StrictMode>,*/
);
