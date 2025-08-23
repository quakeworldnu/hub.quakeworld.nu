import { ServerPoller } from "@qwhub/servers/Servers";
import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";
import { Provider } from "react-redux";
import store from "@qwhub/store";
import { RankingsView } from "./RankingsView";

export const App = () => {
  return (
    <Provider store={store}>
      <SiteHeader />
      <RankingsView />
      <SiteFooter />
      <ServerPoller />
    </Provider>
  );
};

export default App;