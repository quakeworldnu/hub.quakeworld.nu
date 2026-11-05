import { TwitchStreamsPoller } from "@/components/streams/streams";
import { SettingsDrawer } from "@/features/servers/components/server-filters";
import SiteNavigation from "./site-navigation";

export const SiteHeader = () => {
  return (
    <div>
      <SettingsDrawer />
      <TwitchStreamsPoller />

      <div className="flex items-center lg:space-x-4 mt-2 mb-4">
        <a href="/" className="lg:mr-4">
          <img
            src="https://hub.quakeworld.nu/assets/img/quakeworld_hub_logo.png"
            width="95"
            height="50"
            alt="QuakeWorld Hub"
            className="w-[48px] sm:w-[95px] sm:h-[50px] mr-2"
          />
        </a>
        <div className="grow">
          <SiteNavigation />
        </div>
      </div>
    </div>
  );
};
