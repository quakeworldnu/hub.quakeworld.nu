import { useDemoBrowserSettings, useFilteredDemos } from "./hooks.ts";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faPlus,
  faSearch,
  faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { DisplayMode } from "./types.ts";
import { usePlaylist } from "../playlist/hooks.ts";

export const btnSelectedClass =
  "bg-gradient-to-t from-blue-500/20 to-blue-500/40 border-white/10 text-white";
export const btnDefaultClass =
  "flex items-center space-x-2 p-2 px-2.5 cursor-pointer text-sm first:rounded-l last:rounded-r border border-transparent border-white/10 hover:border-white/20 hover:bg-blue-500/20 text-slate-400";

export const Toolbar = () => {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
      <DisplayModeButtons />
      <GameModeButtons />
      <QueryInput />
      <BulkActions />
    </div>
  );
};

export const BulkActions = () => {
  const { demos, hasDemos } = useFilteredDemos();
  const { addMany } = usePlaylist();

  function handleClick() {
    addMany(demos);
  }

  return (
    <button
      disabled={!hasDemos}
      className={classNames(
        "flex items-center bg-slate-800 text-slate-200 text-xs py-2 px-3 rounded border border-white/10 disabled:opacity-60 transition-opacity",
        {
          "hover:bg-slate-700 hover:text-white": hasDemos,
          "cursor-not-allowed opacity-20": !hasDemos,
        },
      )}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faPlus} className="text-slate-400 mr-1 " />
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

  return (
    <div className="flex items-center">
      {options.map((option) => (
        <div
          key={option.value}
          title={`Display as ${option.value}`}
          className={classNames(btnDefaultClass, {
            [btnSelectedClass]: settings.displayMode === option.value,
          })}
          onClick={() => setMode(option.value as DisplayMode)}
        >
          <FontAwesomeIcon icon={option.icon} size="lg" />
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

  return (
    <div className="flex items-center">
      {options.map((option) => (
        <div
          key={option.value}
          className={classNames(btnDefaultClass, {
            [btnSelectedClass]:
              settings.gameMode === option.value.toLowerCase(),
          })}
          onClick={() => setGameMode(option.value.toLowerCase())}
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
        className="-ml-6 px-2 pl-8 py-2 text-sm bg-slate-900 focus:bg-slate-800 border border-slate-700 text-white rounded w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onChange={handleChange}
      />
    </label>
  );
};
