import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { type ChangeEvent, useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { formInput } from "@/components/ui/theme";
import { useGameSettings } from "@/features/demo-browser/stores/browser-settings";

export const MapName = () => {
  const { map, setMap } = useGameSettings();
  const [value, setValue] = useState<string>(map);
  const [debouncedValue] = useDebounceValue<string>(value, 400);

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
