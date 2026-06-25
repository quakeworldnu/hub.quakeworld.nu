import { useState } from "react";
import { GameModeFilter } from "./components/GameModeFilter";
import { RegionFilter } from "./components/RegionFilter";
import { RankingsTable } from "./components/RankingsTable";

export const RankingsView = () => {
  const [gameMode, setGameMode] = useState("4on4");
  const [region, setRegion] = useState("All");

  return (
    <div className="mt-4 mb-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <GameModeFilter gameMode={gameMode} setGameMode={setGameMode} />
          <RegionFilter region={region} setRegion={setRegion} />
        </div>
      </div>
      <RankingsTable gameMode={gameMode} region={region} />
    </div>
  );
};