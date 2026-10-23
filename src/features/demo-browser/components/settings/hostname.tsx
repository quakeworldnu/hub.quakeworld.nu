import { faServer } from "@fortawesome/free-solid-svg-icons";
import { type ChangeEvent, useEffect, useRef } from "react";
import { useDebounceValue } from "usehooks-ts";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { formInput } from "@/components/ui/theme";
import { useGameSettings } from "@/features/demo-browser/stores/browser-settings";

export const Hostname = () => {
  const { hostname, setHostname } = useGameSettings();
  const [value, setValue] = useDebounceValue<string>(hostname, 400);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(normalize(e.target.value));
  }

  useEffect(() => {
    setHostname(value);
  }, [value]);

  // reflect external changes (e.g. QWLeague toggle) in the input
  useEffect(() => {
    const input = inputRef.current;
    if (input && normalize(input.value) !== hostname) {
      input.value = hostname;
    }
  }, [hostname]);

  return (
    <label className="flex items-center ml-2" title="Server hostname">
      <FontAwesomeIcon
        icon={faServer}
        className="z-10 text-slate-500 pointer-events-none"
        size="xs"
      />
      <input
        ref={inputRef}
        type="search"
        defaultValue={hostname}
        className={`${formInput} -ml-6 pl-8 w-32`}
        onChange={handleChange}
      />
    </label>
  );
};

function normalize(value: string): string {
  return value.toLowerCase().trim();
}
