import { HorizontalSeparator } from "@/site/Common";

export const SiteFooter = () => {
  const delimiter = <span> • </span>;
  return (
    <div id="app-footer" className="text-sm">
      <HorizontalSeparator />

      <div className="footer my-6 sm text-gray-600 leading-loose mb-3 space-x-1 app-links">
        <a href="https://quake.world/">Quake.World</a>
        {delimiter}
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
        {delimiter}
        <a href="https://tools.quake.world/">Tools</a>
        {delimiter}
        <a
          href="https://github.com/quakeworldnu/hub.quakeworld.nu"
          className="grayscale"
        >
          Source on GitHub
        </a>
      </div>
    </div>
  );
};
