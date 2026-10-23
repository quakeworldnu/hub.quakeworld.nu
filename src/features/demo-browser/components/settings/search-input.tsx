import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { formInput } from "@/components/ui/theme";

// text setting, committed (normalized) after the user stops typing
export const SearchInput = ({
  icon,
  title,
  className,
  value,
  onChange,
  normalize = (text) => text,
  autoFocus,
}: {
  icon: IconDefinition;
  title: string;
  className: string;
  value: string;
  onChange: (value: string) => void;
  normalize?: (text: string) => string;
  autoFocus?: boolean;
}) => {
  const [text, setText] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const commit = useDebounceCallback(onChange, 400);

  // reflect external changes (e.g. QWLeague toggle) in the input
  if (value !== prevValue) {
    setPrevValue(value);
    if (normalize(text) !== value) {
      setText(value);
    }
  }

  return (
    <label className="flex items-center ml-2" title={title}>
      <FontAwesomeIcon
        icon={icon}
        className="z-10 text-slate-500 pointer-events-none"
        size="xs"
      />
      <input
        autoFocus={autoFocus}
        type="search"
        value={text}
        className={`${formInput} -ml-6 pl-8 ${className}`}
        onChange={(e) => {
          setText(e.target.value);
          commit(normalize(e.target.value));
        }}
      />
    </label>
  );
};

export function normalizeLowerTrim(text: string): string {
  return text.toLowerCase().trim();
}
