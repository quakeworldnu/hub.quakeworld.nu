import { GameGrid } from "./GameGrid.tsx";
import { GameList } from "./GameList.tsx";
import { GamesProvider, useDemos } from "./context.tsx";
import { Pagination } from "./settings/Pagination.tsx";
import { Toolbar } from "./settings/Toolbar.tsx";
import { DemoSettingsProvider, useDemoSettings } from "./settings/context.tsx";

export const Browser = () => {
  return (
    <div className="space-y-4">
      <DemoSettingsProvider localStorageKey="mainDemoBrowser.settings.v2">
        <GamesProvider>
          <Toolbar />
          <Demos />
          <Pagination />
        </GamesProvider>
      </DemoSettingsProvider>
    </div>
  );
};

const Demos = () => {
  const { displayMode } = useDemoSettings();
  const { games, hasGames, isLoading } = useDemos();

  return (
    <div>
      {displayMode === "Grid" ? (
        <GameGrid games={games} />
      ) : (
        <GameList games={games} />
      )}
      {isLoading && <div className="text-slate-400">Loading demos...</div>}

      {!isLoading && !hasGames && (
        <div className="text-slate-400">No demos found.</div>
      )}
    </div>
  );
};
