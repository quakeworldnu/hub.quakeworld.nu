import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "@/store";
import App from "./App";
import "@/styles/index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

if (import.meta.env.PROD) {
  console.log(`
██╗  ██╗██╗   ██╗██████╗ 
██║  ██║██║   ██║██╔══██╗
███████║██║   ██║██████╔╝
██╔══██║██║   ██║██╔══██╗
██║  ██║╚██████╔╝██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═════╝

source code: https://github.com/quakeworldnu/hub.quakeworld.nu
`);
}
