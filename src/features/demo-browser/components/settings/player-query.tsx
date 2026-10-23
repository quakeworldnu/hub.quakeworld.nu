import { faUser } from "@fortawesome/free-solid-svg-icons";
import { type ChangeEvent, useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { formInput } from "@/components/ui/theme";
import { useGameSettings } from "@/features/demo-browser/stores/browser-settings";

export const PlayerQuery = () => {
  const { playerQuery, setPlayerQuery } = useGameSettings();
  const [value, setValue] = useState<string>(playerQuery);
  const [debouncedValue] = useDebounceValue<string>(value, 400);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  useEffect(() => {
    setPlayerQuery(debouncedValue);
  }, [debouncedValue]);

  return (
    <label
      className="flex items-center ml-2"
      title="Player(s), separate with space"
    >
      <FontAwesomeIcon
        icon={faUser}
        className="z-10 text-slate-500 pointer-events-none"
        size="xs"
      />
      <input
        autoFocus
        type="search"
        value={value}
        className={`${formInput} -ml-6 pl-8 w-44`}
        onChange={handleChange}
      />
    </label>
  );
};
