import { faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import { formInput } from "../../ui/theme.ts";
import { useGameSettings } from "./context.tsx";

export const Matchtag = () => {
  const { matchtag, setMatchtag } = useGameSettings();
  const [value, setValue] = useDebounceValue<string>(matchtag, 400);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value.toLowerCase().trim());
  }

  useEffect(() => {
    setMatchtag(value);
  }, [value]);

  return (
    <label className="flex items-center ml-2" title="Matchtag">
      <FontAwesomeIcon
        icon={faTag}
        className="z-10 text-slate-500 pointer-events-none"
        size="xs"
      />
      <input
        type="search"
        defaultValue={matchtag}
        className={`${formInput} -ml-6 pl-8 w-24`}
        onChange={handleChange}
      />
    </label>
  );
};
