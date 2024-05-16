import { FeaturedStreams } from "@qwhub/Streams";
import SiteNavigation from "@qwhub/site/Navigation";
import { SettingsDrawer } from "@qwhub/site/settings/ServerSettings.jsx";
import classNames from "classnames";

export const SiteHeader = () => {
  const showStreamsOnSm = ["/", "/players/"].includes(location.pathname);

  return (
    <div>
      <SettingsDrawer />

      <div>
        <div className="lg:flex items-center">
          <div className="flex items-center lg:space-x-4 my-2">
            <a href="/" className="lg:mr-4">
              <img
                src="https://hub.quakeworld.nu/assets/img/quakeworld_hub_logo.png"
                width="95"
                height="50"
                alt="QuakeWorld Hub"
                className="w-[48px] sm:w-[95px] sm:h-[50px] mr-2"
              />
            </a>
            <div className="lg:hidden grow">
              <SiteNavigation />
            </div>
          </div>
          <div
            className={classNames("mt-2", {
              "hidden sm:block": !showStreamsOnSm,
            })}
          >
            <FeaturedStreams />
          </div>
        </div>
        <div className="hidden lg:flex mt-1">
          <SiteNavigation />
        </div>
      </div>
    </div>
  );
};
