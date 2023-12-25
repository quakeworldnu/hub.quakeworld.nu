import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce, useLocalStorage } from "usehooks-ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faPlus,
  faSearch,
  faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { useDemoBrowserSettings } from "./hooks.ts";
import { DisplayMode } from "./types.ts";
import { usePlaylist } from "../playlist/hooks.ts";
import { Pagination } from "./Pagination.tsx";
import { useDemos } from "./context.tsx";
import { Switch } from "../ui/Switch.tsx";
import {
  btnSecondary,
  formInput,
  sizeSmall,
  toggleBtn,
  toggleBtnSelected,
} from "../ui/theme.ts";

export const Toolbar = () => {
  const { isLoading } = useDemos();

  return (
    <div
      className={classNames("flex flex-wrap gap-x-6 gap-y-3 items-center", {
        "pointer-events-none": isLoading,
      })}
    >
      <DisplayModeButtons />
      <GlobalShowScoresToggle />
      <GameModeButtons />
      <QueryInput />
      <Pagination />
      {/*<BulkActions />*/}
    </div>
  );
};

const GlobalShowScoresToggle = () => {
  const [showScores, setShowScores] = useLocalStorage<boolean>(
    "demoBrowserShowScores",
    false,
  );

  function handleClick() {
    setShowScores(!showScores);
  }

  return (
    <div className="text-sm">
      <Switch
        label={"Show scores"}
        enabled={showScores}
        onClick={handleClick}
      />
    </div>
  );
};

export const BulkActions = () => {
  const { demos, hasDemos } = useDemos();
  const { addMany } = usePlaylist();

  function handleClick() {
    addMany(demos);
  }

  return (
    <button
      disabled={!hasDemos}
      className={`${btnSecondary} ${sizeSmall}`}
      onClick={handleClick}
    >
      <FontAwesomeIcon
        fixedWidth
        icon={faPlus}
        className="text-slate-400 mr-1 "
      />
      Add all to playlist
    </button>
  );
};

export const DisplayModeButtons = () => {
  const { settings, setSettings } = useDemoBrowserSettings();

  function setMode(displayMode: DisplayMode) {
    setSettings({ ...settings, displayMode });
  }

  const options = [
    { icon: faTableCells, label: "Grid", value: "grid" },
    { icon: faBars, label: "List", value: "list" },
  ];

  function handleClick(value: string) {
    setMode(value as DisplayMode);
  }

  return (
    <div className="flex items-center space-x-px">
      {options.map((option) => (
        <div
          key={option.value}
          title={`Display as ${option.value}`}
          className={classNames(`${toggleBtn} ${sizeSmall}`, {
            [toggleBtnSelected]: settings.displayMode === option.value,
          })}
          onClick={() => handleClick(option.value)}
        >
          <FontAwesomeIcon fixedWidth icon={option.icon} />
          <div>{option.label}</div>
        </div>
      ))}
    </div>
  );
};
export const GameModeButtons = () => {
  const { settings, setSettings } = useDemoBrowserSettings();

  function setGameMode(gameMode: string) {
    setSettings({ ...settings, gameMode });
  }

  const options = [
    {
      value: "all",
      label: "All",
    },
  ].concat(
    ["1on1", "2on2", "4on4", "CTF"].map((mode) => ({
      label: mode,
      value: mode,
    })),
  );

  function handleClick(mode: string) {
    setGameMode(mode.toLowerCase());
  }

  return (
    <div className="flex items-center space-x-px">
      {options.map((option) => (
        <div
          key={option.value}
          className={classNames(`${toggleBtn} ${sizeSmall}`, {
            [toggleBtnSelected]:
              settings.gameMode === option.value.toLowerCase(),
          })}
          onClick={() => handleClick(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};
export const QueryInput = () => {
  const { settings, setSettings } = useDemoBrowserSettings();
  const [query, setQuery] = useState<string>(settings.query);
  const debouncedQuery = useDebounce<string>(query, 400);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  useEffect(() => {
    setSettings({ ...settings, query: debouncedQuery });
  }, [debouncedQuery]);

  return (
    <label className="flex items-center ml-2">
      <FontAwesomeIcon
        icon={faSearch}
        className="z-10 text-slate-500 pointer-events-none"
        size="sm"
      />
      <input
        autoFocus
        type="search"
        value={query}
        className={`${formInput} -ml-6 pl-8 w-72`}
        onChange={handleChange}
      />
    </label>
  );
};
