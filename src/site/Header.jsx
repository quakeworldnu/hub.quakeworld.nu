import SiteNavigation from "@/site/Navigation";
import Streams from "@/Streams";

export const SiteHeader = () => {
  return (
    <div className="mt-2 mb-4">
      <div className="space-y-2 lg:flex">
        <div className="flex items-center space-x-4">
          <a href="/" className="min-w-[48px] lg:pt-2 lg:mr-4">
            <img
              src="/assets/img/quakeworld_hub_logo.png"
              width="95"
              height="50"
              alt="QuakeWorld Hub"
              className="w-16 sm:w-auto"
            />
          </a>
          <div className="lg:hidden">
            <SiteNavigation />
          </div>
        </div>
        <Streams />
      </div>
      <div className="hidden lg:block lg:my-3">
        <SiteNavigation />
      </div>
    </div>
  );
};
