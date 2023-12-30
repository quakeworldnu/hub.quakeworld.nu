import { useDemoSettings } from "./context.tsx";
import { GameMode } from "./types.ts";
import classNames from "classnames";
import { sizeSmall, toggleBtn, toggleBtnSelected } from "../../ui/theme.ts";

export const GameModeBar = () => {
  const { gameMode, setGameMode } = useDemoSettings();
  const modes: GameMode[] = ["All", "1on1", "2on2", "4on4", "CTF"];

  function handleClick(mode: GameMode) {
    setGameMode(mode);
  }

  return (
    <div className="flex items-center space-x-px">
      {modes.map((mode) => (
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
