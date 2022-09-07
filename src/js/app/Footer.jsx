import React from "@types/react";
import Events from "../Events";
import ForumPosts from "../ForumPosts";
import News from "../News";

export const AppFooter = () => {
  return (
    <div id="app-footer" className="animation-fade-in-delayed">
      <hr className="my-6 sm:my-10 border-blue-600/50" />
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <News />
        <ForumPosts />
        <Events />
      </div>
      <hr className="my-4 sm:my-6 border-blue-600/50" />
      <div className="sm:columns-2 my-6 footer text-gray-600">
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
          <a href="https://github.com/vikpe/qw-hub">View on GitHub</a>
        </div>
      </div>
    </div>
  );
};
