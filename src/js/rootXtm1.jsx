import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import BrowserXtm1 from "./features/Browser/BrowserXtm1";
import store from "./features/Browser/store";

const targetElement = document.getElementById("root");
targetElement.className = "";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserXtm1 />
    </Provider>
  </React.StrictMode>,
  targetElement
);

if (import.meta.hot) {
  import.meta.hot.accept();
}
