import { DemoGrid } from "./DemoGrid.tsx";
import { useDemoBrowserSettings } from "./hooks.ts";
import { DemoList } from "./DemoList.tsx";
import { Toolbar } from "./Toolbar.tsx";
import { Pagination } from "./Pagination.tsx";
import { useDemos } from "./context.tsx";

export const Browser = () => {
  return (
    <div className="space-y-4">
      <Toolbar />
      <Demos />
      <Pagination />
    </div>
  );
};

const Demos = () => {
  const { settings } = useDemoBrowserSettings();
  const { demos, hasDemos } = useDemos();

  return (
    <div>
      {settings.displayMode === "grid" ? (
        <DemoGrid demos={demos} />
      ) : (
        <DemoList demos={demos} />
      )}

      {!hasDemos && <div className="text-slate-400">No demos found.</div>}
    </div>
  );
};
