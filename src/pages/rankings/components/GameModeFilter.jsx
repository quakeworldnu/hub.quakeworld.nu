import classNames from "classnames";

const gameModes = ["1on1", "2on2", "4on4"]; // Wipeout temporarily hidden until KTX stats are ready

// Theme constants matching the games page
const sizeSmall = "py-2 px-2.5 text-xs";
const controlDisabled = "select-none transition-opacity disabled:opacity-60 disabled:cursor-not-allowed disabled:events-none";
const control = `flex items-center whitespace-nowrap cursor-pointer ${controlDisabled}`;
const toggleBtn = `${control} space-x-1 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 first:rounded-l last:rounded-r`;
const toggleBtnSelected = "text-white font-bold bg-gradient-to-b from-sky-700 to-sky-900";

export const GameModeFilter = ({ gameMode, setGameMode }) => {
  return (
    <div className="flex items-center space-x-px">
      {gameModes.map((mode) => (
        <div
          key={mode}
          className={classNames(`${toggleBtn} ${sizeSmall}`, {
            [toggleBtnSelected]: gameMode === mode,
          })}
          onClick={() => setGameMode(mode)}
        >
          {mode}
        </div>
      ))}
    </div>
  );
};