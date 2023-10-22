import { DemoGrid } from "./DemoGrid.tsx";
import { useDemoBrowserSettings, useSearchDemos } from "./hooks.ts";
import { DemoList } from "./DemoList.tsx";
import { Playlist } from "../playlist/Playlist.tsx";
import { Toolbar } from "./Toolbar.tsx";

export const Browser = () => {
  return (
    <div className="my-6">
      <Toolbar />
      <div className="flex gap-6">
        <Demos />
        <div className="w-96 my-6">
          <Playlist />
        </div>
      </div>
    </div>
  );
};

const Demos = () => {
  const { settings } = useDemoBrowserSettings();
  const { demos } = useSearchDemos(settings);

  return (
    <div className="grow">
      {settings.displayMode === "grid" ? (
        <DemoGrid demos={demos} />
      ) : (
        <DemoList demos={demos} />
      )}

      {demos?.length === 0 && (
        <div className="text-slate-400">No demos found.</div>
      )}
    </div>
  );
};
