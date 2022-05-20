import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import Browser from "./features/Browser/Browser";
import store from "./features/Browser/store";

const container = document.getElementById("root");
container.className = "";

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Browser />
    </Provider>
  </React.StrictMode>
);

if (import.meta.hot) {
  import.meta.hot.accept();
}


