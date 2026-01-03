import { faServer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import { formInput } from "../../ui/theme.ts";
import { useGameSettings } from "./context.tsx";

export const Hostname = () => {
  const { hostname, setHostname } = useGameSettings();
  const [value, setValue] = useDebounceValue<string>(hostname, 400);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value.toLowerCase().trim());
  }

  useEffect(() => {
    setHostname(value);
  }, [value]);

  return (
    <label className="flex items-center ml-2" title="Server hostname">
      <FontAwesomeIcon
        icon={faServer}
        className="z-10 text-slate-500 pointer-events-none"
        size="xs"
      />
      <input
        type="search"
        defaultValue={hostname}
        className={`${formInput} -ml-6 pl-8 w-32`}
        onChange={handleChange}
      />
    </label>
  );
};
