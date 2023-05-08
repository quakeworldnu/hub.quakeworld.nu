import { HorizontalSeparator } from "@/site/Common";

export const SiteFooter = () => {
  const delimiter = <span> • </span>;
  return (
    <div id="app-footer" className="text-sm">
      <HorizontalSeparator />

      <div className="footer my-6 sm:columns-2 text-gray-600">
        <div className="mb-3 space-x-1 app-links">
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
          <a href="https://github.com/quakeworldnu/hub.quakeworld.nu" className="app-link">
            Source on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
