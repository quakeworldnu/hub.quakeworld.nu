import { Pagination } from "@/features/demo-browser/components/settings/pagination";
import { Toolbar } from "@/features/demo-browser/components/settings/toolbar";
import {
  GameSettingsProvider,
  useGameSettings,
} from "@/features/demo-browser/stores/browser-settings";
import { GamesProvider, useGames } from "@/features/demo-browser/stores/games";
import { GameGrid } from "./game-grid";
import { GameList } from "./game-list";

export const Browser = () => {
  return (
    <div className="space-y-4">
      <GameSettingsProvider localStorageKey="mainDemoBrowser.settings.v5">
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
      {isLoading && !hasGames && (
        <div className="flex min-h-[25vh] text-gray-300 justify-center items-center bg-[#223]">
          loading ..
        </div>
      )}

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
