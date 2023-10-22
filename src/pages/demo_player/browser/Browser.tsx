import { Grid } from "./Grid.tsx";
import { useDemoBrowserSettings, useSearchDemos } from "./hooks.ts";
import { List } from "./List.tsx";
import { Playlist } from "../playlist/Playlist.tsx";
import { Settings } from "./Settings.tsx";

export const Browser = () => {
  return (
    <div className="my-6">
      <Settings />
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
        <Grid demos={demos} />
      ) : (
        <List demos={demos} />
      )}

      {demos?.length === 0 && (
        <div className="text-slate-400">No demos found.</div>
      )}
    </div>
  );
};
