import { DemoGrid } from "./DemoGrid.tsx";
import { useDemoBrowserSettings } from "./hooks.ts";
import { DemoList } from "./DemoList.tsx";
import { Playlist } from "../playlist/Playlist.tsx";
import { Toolbar } from "./Toolbar.tsx";
import { Pagination } from "./Pagination.tsx";
import { useDemos } from "./context.tsx";

export const Browser = () => {
  return (
    <div className="my-6">
      <div className="flex gap-6">
        <div className="grow">
          <Toolbar />
          <Demos />
          <Pagination />
        </div>
        <div className="w-96">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  return <Playlist />;
};

const Demos = () => {
  const { settings } = useDemoBrowserSettings();
  const { demos, hasDemos } = useDemos();

  return (
    <div className="grow">
      {settings.displayMode === "grid" ? (
        <DemoGrid demos={demos} />
      ) : (
        <DemoList demos={demos} />
      )}

      {!hasDemos && <div className="text-slate-400">No demos found.</div>}
    </div>
  );
};
