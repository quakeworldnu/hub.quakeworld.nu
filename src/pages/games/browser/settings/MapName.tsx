import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { formInput } from "../../ui/theme.ts";
import { useGameSettings } from "./context.tsx";

export const MapName = () => {
  const { map, setMap } = useGameSettings();
  const [value, setValue] = useState<string>(map);
  const debouncedValue = useDebounce<string>(value, 400);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value.toLowerCase().trim());
  }

  useEffect(() => {
    setMap(debouncedValue);
  }, [debouncedValue]);

  return (
    <label className="flex items-center ml-2" title="Map">
      <FontAwesomeIcon
        icon={faGlobe}
        className="z-10 text-slate-500 pointer-events-none"
        size="xs"
      />
      <input
        type="search"
        value={value}
        className={`${formInput} -ml-6 pl-8 w-28`}
        onChange={handleChange}
      />
    </label>
  );
};
