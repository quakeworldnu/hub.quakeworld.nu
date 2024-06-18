import { AppBody } from "@qwhub/pages/games/AppBody.tsx";
import { ServerPoller } from "@qwhub/servers/Servers.jsx";
import { ToastContainer } from "react-toastify";
import { SiteFooter } from "../../site/Footer";
import { SiteHeader } from "../../site/Header";
import { Sidebar } from "./Sidebar";

export const App = () => {
  return (
    <div className="flex flex-col">
      <SiteHeader />
      <div className="3xl:flex gap-6 my-4">
        <div className="w-full">
          <AppBody />
        </div>
        <Sidebar />
      </div>
      <SiteFooter />
      <ServerPoller pollingInterval={30} />
      <ToastContainer
        hideProgressBar
        position="bottom-right"
        theme="dark"
        autoClose={1500}
      />
    </div>
  );
};

export default App;
