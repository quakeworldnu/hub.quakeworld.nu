import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { formInput } from "../../ui/theme.ts";
import { useDemoSettings } from "./context.tsx";

export const SearchQuery = () => {
  const { query, setQuery } = useDemoSettings();
  const [queryValue, setQueryValue] = useState<string>(query);
  const debouncedQuery = useDebounce<string>(queryValue, 400);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setQueryValue(e.target.value);
  }

  useEffect(() => {
    setQuery(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <label className="flex items-center ml-2">
      <FontAwesomeIcon
        icon={faSearch}
        className="z-10 text-slate-500 pointer-events-none"
        size="sm"
      />
      <input
        autoFocus
        type="search"
        value={queryValue}
        className={`${formInput} -ml-6 pl-8 w-72`}
        onChange={handleChange}
      />
    </label>
  );
};
