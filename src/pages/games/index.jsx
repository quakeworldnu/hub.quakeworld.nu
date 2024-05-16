import store from "@qwhub/store";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App";
import "@qwhub/styles/index.scss";
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  /*<React.StrictMode>*/
  <Provider store={store}>
    {/*<ConvexProvider client={convex}>*/}
    <App />
    {/*</ConvexProvider>*/}
  </Provider>,
  /*</React.StrictMode>,*/
);
