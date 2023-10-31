import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import store from "@qwhub/store";
import App from "./App";
import "@qwhub/styles/index.scss";
import { DemoProvider } from "@qwhub/pages/recent_games/browser/context";
import { ClipEditorProvider } from "@qwhub/pages/recent_games/player/clips/context";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.createRoot(document.getElementById("root")).render(
  /*<React.StrictMode>*/
  <Provider store={store}>
    <ConvexProvider client={convex}>
      <DemoProvider>
        <ClipEditorProvider>
          <App />
        </ClipEditorProvider>
      </DemoProvider>
    </ConvexProvider>
  </Provider>,
  /*</React.StrictMode>,*/
);
