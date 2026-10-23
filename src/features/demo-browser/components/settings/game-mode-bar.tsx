import clsx from "clsx";
import { sizeSmall, toggleBtn, toggleBtnSelected } from "@/components/ui/theme";
import { useGameSettings } from "@/features/demo-browser/stores/browser-settings";
import { type GameMode, gameModes } from "@/types/games";

export const GameModeBar = () => {
  const { gameMode, setGameMode } = useGameSettings();

  function handleClick(mode: GameMode) {
    setGameMode(mode);
  }

  return (
    <div className="flex items-center space-x-px">
      {gameModes.map((mode) => (
        <div
          key={mode}
          className={clsx(`${toggleBtn} ${sizeSmall}`, {
            [toggleBtnSelected]: gameMode === mode,
          })}
          onClick={() => handleClick(mode)}
        >
          {mode}
        </div>
      ))}
    </div>
  );
};
