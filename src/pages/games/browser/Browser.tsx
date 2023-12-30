import { DemoGrid } from "./DemoGrid.tsx";
import { DemoSettingsProvider, useDemoSettings } from "./settings/context.tsx";
import { DemoList } from "./DemoList.tsx";
import { Toolbar } from "./settings/Toolbar.tsx";
import { Pagination } from "./settings/Pagination.tsx";
import { DemoProvider, useDemos } from "./context.tsx";

export const Browser = () => {
  return (
    <div className="space-y-4">
      <DemoSettingsProvider localStorageKey="mainDemoBrowser.settings.v2">
        <DemoProvider>
          <Toolbar />
          <Demos />
          <Pagination />
        </DemoProvider>
      </DemoSettingsProvider>
    </div>
  );
};

const Demos = () => {
  const { displayMode } = useDemoSettings();
  const { demos, hasDemos, isLoading } = useDemos();

  return (
    <div>
      {displayMode === "Grid" ? (
        <DemoGrid demos={demos} />
      ) : (
        <DemoList demos={demos} />
      )}
      {isLoading && <div className="text-slate-400">Loading demos...</div>}

      {!isLoading && !hasDemos && (
        <div className="text-slate-400">No demos found.</div>
      )}
    </div>
  );
};
