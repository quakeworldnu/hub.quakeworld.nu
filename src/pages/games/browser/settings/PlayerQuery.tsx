import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { formInput } from "../../ui/theme.ts";
import { useGameSettings } from "./context.tsx";

export const PlayerQuery = () => {
  const { playerQuery, setPlayerQuery } = useGameSettings();
  const [value, setValue] = useState<string>(playerQuery);
  const debouncedValue = useDebounce<string>(value, 400);

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
        icon={faUsers}
        className="z-10 text-slate-500 pointer-events-none"
        size="xs"
      />
      <input
        autoFocus
        type="search"
        value={value}
        className={`${formInput} -ml-6 pl-8 w-48`}
        onChange={handleChange}
      />
    </label>
  );
};
