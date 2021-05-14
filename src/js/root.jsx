import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Browser from "./features/Browser/Browser";
import store from "./features/Browser/store";

const targetElement = document.getElementById("root");
targetElement.className = "";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Browser />
    </Provider>
  </React.StrictMode>,
  targetElement
);

if (import.meta.hot) {
  import.meta.hot.accept();
}
