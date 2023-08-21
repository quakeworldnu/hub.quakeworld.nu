import SiteNavigation from "@qwhub/site/Navigation";
import Streams from "@qwhub/Streams";
import { Settings } from "@qwhub/site/Settings";

export const SiteHeader = () => (
  <div className="mt-2">
    <div>
      <div className="lg:flex items-center">
        <div className="flex items-center space-x-2 lg:space-x-4 my-2">
          <a href="/" className="lg:mr-4">
            <img
              src="https://hub.quakeworld.nu/assets/img/quakeworld_hub_logo.png"
              width="95"
              height="50"
              alt="QuakeWorld Hub"
              className="w-[48px] sm:w-[95px] sm:h-[50px]"
            />
          </a>
          <div className="lg:hidden grow">
            <SiteNavigation />
          </div>
        </div>
        <Streams />
      </div>
      <div className="hidden lg:flex mt-1">
        <SiteNavigation />
      </div>
    </div>

    <Settings />
  </div>
);
