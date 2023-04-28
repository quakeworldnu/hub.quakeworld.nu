import Events from "@/Events";
import ForumPosts from "@/ForumPosts";
import News from "@/News";
import GamesInSpotlight from "@/GamesInSpotlight";

const HorizontalSeparator = () => <hr className="border-blue-600/40" />;

export const SiteFooter = () => {
  const delimiter = <span> • </span>;
  return (
    <div id="app-footer" className="text-sm">
      <HorizontalSeparator />

      <div className="my-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <GamesInSpotlight />
        <News />
        <ForumPosts />
        <Events />
      </div>

      <HorizontalSeparator />

      <div className="footer my-6 sm:columns-2 text-gray-600">
        <div className="mb-3 space-x-1">
          <a href="https://www.quakeworld.nu/">QuakeWorld.nu</a>
          {delimiter}
          <a href="https://discord.quake.world/">Discord</a>
          {delimiter}
          <a href="https://www.twitch.tv/quakeworld">Twitch</a>
          {delimiter}
          <a href="https://www.quakeworld.nu/wiki/Overview">Wiki</a>
          {delimiter}
          <a href="https://tools.quake.world/servers/">Servers</a>
          {delimiter}
          <a href="https://tools.quake.world/recent-demos/">Recent demos</a>
        </div>
        <div className="sm:text-right">
          <a href="https://github.com/quakeworldnu/hub.quakeworld.nu">
            Source on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
