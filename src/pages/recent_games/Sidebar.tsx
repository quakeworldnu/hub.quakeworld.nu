import { Playlist } from "./playlist/Playlist.tsx";
import { useElementHeight } from "./hooks.ts";

const minMaxHeight = 640;

export const Sidebar = () => {
  const height = useElementHeight("AppDemoBrowserBody");
  const maxHeight = `${Math.max(minMaxHeight, height)}px`;

  return (
    <div className="my-6 lg:my-0 lg:w-[420px]" style={{ maxHeight }}>
      <Playlist />
    </div>
  );
};
