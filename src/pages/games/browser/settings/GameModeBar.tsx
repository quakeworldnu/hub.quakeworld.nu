import classNames from "classnames";
import { sizeSmall, toggleBtn, toggleBtnSelected } from "../../ui/theme.ts";
import { useGameSettings } from "./context.tsx";
import { type GameMode, gameModes } from "./types.ts";

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
          className={classNames(`${toggleBtn} ${sizeSmall}`, {
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
