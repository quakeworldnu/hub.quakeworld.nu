import { GameGrid } from "./GameGrid.tsx";
import { GameList } from "./GameList.tsx";
import { GamesProvider, useGames } from "./context.tsx";
import { Pagination } from "./settings/Pagination.tsx";
import { Toolbar } from "./settings/Toolbar.tsx";
import { GameSettingsProvider, useGameSettings } from "./settings/context.tsx";

export const Browser = () => {
  return (
    <div className="space-y-4">
      <GameSettingsProvider localStorageKey="mainDemoBrowser.settings.v3">
        <GamesProvider>
          <Toolbar />
          <Games />
          <Pagination />
        </GamesProvider>
      </GameSettingsProvider>
    </div>
  );
};

const Games = () => {
  const { displayMode } = useGameSettings();
  const { games, hasGames, isLoading } = useGames();

  return (
    <div>
      {displayMode === "Grid" ? (
        <GameGrid games={games} />
      ) : (
        <GameList games={games} />
      )}

      {!isLoading && !hasGames && (
        <div className="text-slate-400">No games found.</div>
      )}
    </div>
  );
};
