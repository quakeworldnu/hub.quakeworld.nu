import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGameSettings } from "@qwhub/pages/games/browser/settings/context.tsx";
import classNames from "classnames";
import type { ChangeEvent } from "react";
import { formInput } from "../../ui/theme.ts";

const options = [
  { value: 1, label: "Last day" },
  { value: 7, label: "Last week" },
  { value: 30, label: "Last month" },
  { value: 90, label: "Last 3 months" },
  { value: 365, label: "Last year" },
  { value: 0, label: "All time" },
];

export const Timeframe = () => {
  const { maxAge = 30, setMaxAge } = useGameSettings();

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    setMaxAge(Number.parseInt(e.target.value));
  }

  return (
    <div className="flex items-center ml-2">
      <FontAwesomeIcon
        icon={faClock}
        className="z-10 text-slate-500 pointer-events-none"
        size="xs"
      />
      <select
        className={classNames(formInput, "-ml-6 pl-7 w-32")}
        onChange={handleChange}
        defaultValue={maxAge}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
