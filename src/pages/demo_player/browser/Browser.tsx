import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSquare } from "@fortawesome/free-solid-svg-icons";
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
    "p-1 px-1.5 cursor-pointer rounded border border-transparent hover:border-white/10 text-slate-400";

  return (
    <div className="flex space-x-2 items-center">
      <div
        title="Display as grid"
        className={classNames(defaultClass, {
          [selectedClass]: settings.displayMode === "grid",
        })}
        onClick={() => setMode("grid")}
      >
        <FontAwesomeIcon icon={faSquare} size={"xl"} />
      </div>
      <div
        title="Display as list"
        className={classNames(defaultClass, {
          [selectedClass]: settings.displayMode === "list",
        })}
        onClick={() => setMode("list")}
      >
        <FontAwesomeIcon icon={faBars} size={"xl"} />
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
    <div>
      <input
        type="search"
        value={query}
        className="px-2 py-1 bg-blue-950 border border-blue-800 text-white"
        onChange={onChange}
      />
    </div>
  );
};
