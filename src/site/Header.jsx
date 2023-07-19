import SiteNavigation from "@qwhub/site/Navigation";
import Streams from "@qwhub/Streams";

export const SiteHeader = () => {
  return (
    <div className="mt-2">
      <div className="lg:space-y-2 lg:flex">
        <div className="flex items-center space-x-4 mb-2">
          <a href="/" className="min-w-[48px] lg:pt-2 lg:mr-4">
            <img
              src="https://hub.quakeworld.nu/assets/img/quakeworld_hub_logo.png"
              width="95"
              height="50"
              alt="QuakeWorld Hub"
              className="w-16 sm:w-auto"
            />
          </a>
          <div className="lg:hidden pb-1">
            <SiteNavigation />
          </div>
        </div>
        <Streams />
      </div>
      <div className="hidden lg:block lg:mt-3">
        <SiteNavigation />
      </div>
    </div>
  );
};
