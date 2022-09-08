import ServerOverview from "../servers/Overview";
import Streams from "../Streams";

export const AppHeader = () => {
  return (
    <div className="my-4 animation-fade-in-down">
      <div className="space-y-2 lg:flex">
        <div className="flex items-center space-x-4">
          <a href="/" className="lg:pt-2 min-w-[82px] lg:mr-4">
            <img src="/assets/img/qtvlogo.svg" width="82" height="59" alt="QuakeWorld Hub" />
          </a>
          <div className="lg:hidden">
            <ServerOverview />
          </div>
        </div>
        <Streams />
      </div>
      <div className="hidden lg:block lg:my-3">
        <ServerOverview />
      </div>
    </div>
  );
};
