import Events from "../Events";
import ForumPosts from "../ForumPosts";
import News from "../News";

const HorizontalSeparator = () => (<hr className="border-blue-600/40" />);

export const AppFooter = () => {
  return (
    <div id="app-footer" className="animation-fade-in-delayed text-sm">
      <HorizontalSeparator />

      <div className="my-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <News />
        <ForumPosts />
        <Events />
      </div>

      <HorizontalSeparator />

      <div className="footer my-6 sm:columns-2 text-gray-600">
        <div className="mb-3">
          <a href="https://www.quakeworld.nu/">QuakeWorld.nu</a>
          <span className="px-1"> • </span>
          <a href="https://discord.quake.world/">Discord</a>
          <span className="px-1"> • </span>
          <a href="https://www.twitch.tv/quakeworld">Twitch</a>
          <span className="px-1"> • </span>
          <a href="https://www.quakeworld.nu/wiki/Overview">Wiki</a>
        </div>
        <div className="sm:text-right">
          <a href="https://github.com/quakeworldnu/hub.quakeworld.nu">View on GitHub</a>
        </div>
      </div>
    </div>
  );
};
