import { faClock } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import type { ChangeEvent } from "react";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { formInput } from "@/components/ui/theme";
import { useGameSettings } from "@/features/demo-browser/stores/browser-settings";

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
    setMaxAge(Number.parseInt(e.target.value, 10));
  }

  return (
    <div className="flex items-center ml-2">
      <FontAwesomeIcon
        icon={faClock}
        className="z-10 text-slate-500 pointer-events-none"
        size="xs"
      />
      <select
        className={clsx(formInput, "-ml-6 pl-7 w-32")}
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
