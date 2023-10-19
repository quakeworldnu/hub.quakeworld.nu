import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "usehooks-ts";

import { Grid } from "./Grid.tsx";
import { useDemoBrowserSettings, useSearchDemos } from "./hooks.ts";
import { DisplayMode } from "./types.ts";
import { List } from "./List.tsx";
import classNames from "classnames";

export const Browser = () => {
  const { settings } = useDemoBrowserSettings();
  const { demos } = useSearchDemos(settings);

  return (
    <div className="my-6">
      <Settings />
      {settings.displayMode === "grid" ? (
        <Grid demos={demos} />
      ) : (
        <List demos={demos} />
      )}

      {demos?.length === 0 && (
        <div className="text-slate-400">No demos found.</div>
      )}
    </div>
  );
};

export const Settings = () => {
  return (
    <div className="flex space-x-10 items-center">
      <DisplayModeInput />
      <QueryInput />
    </div>
  );
};

const DisplayModeInput = () => {
  const { settings, setSettings } = useDemoBrowserSettings();

  function setMode(displayMode: DisplayMode) {
    setSettings({ ...settings, displayMode });
  }

  const selectedClass = "bg-blue-500/20 border-white/10 text-white";
  const defaultClass =
    "flex items-center space-x-2 p-2 px-3 cursor-pointer text-sm first:rounded-l last:rounded-r border border-transparent border-white/10 hover:border-white/20 hover:bg-blue-500/20 text-slate-400";

  return (
    <div className="flex items-center">
      <div
        title="Display as grid"
        className={classNames(defaultClass, {
          [selectedClass]: settings.displayMode === "grid",
        })}
        onClick={() => setMode("grid")}
      >
        <FontAwesomeIcon icon={faTableCells} size="lg" />
        <div>Grid</div>
      </div>
      <div
        title="Display as list"
        className={classNames(defaultClass, {
          [selectedClass]: settings.displayMode === "list",
        })}
        onClick={() => setMode("list")}
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
        <div>List</div>
      </div>
    </div>
  );
};

const QueryInput = ({ defaultValue = "" }) => {
  const [query, setQuery] = useState<string>(defaultValue);
  const { settings, setSettings } = useDemoBrowserSettings();
  const debouncedQuery = useDebounce<string>(query, 400);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  useEffect(() => {
    setSettings({ ...settings, query: debouncedQuery });
  }, [debouncedQuery]);

  return (
    <label className="flex items-center">
      <FontAwesomeIcon
        icon={faSearch}
        className="z-10 text-slate-500 pointer-events-none"
      />
      <input
        autoFocus
        type="search"
        value={query}
        className="-ml-6 px-2 pl-8 py-2 text-sm bg-blue-950 border border-blue-800 text-white rounded"
        onChange={onChange}
      />
    </label>
  );
};
