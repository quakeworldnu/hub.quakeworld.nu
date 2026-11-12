import clsx from "clsx";
import type { ReactNode } from "react";
import { toggleBtn, toggleBtnSelected } from "./theme";

type Option<T extends string> = {
  value: T;
  label: ReactNode;
  title?: string;
};

// segmented buttons, same height as form inputs, borders collapse (-1px)
export function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex items-center">
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            type="button"
            key={option.value}
            title={option.title}
            aria-pressed={isSelected}
            className={clsx(
              `${toggleBtn} py-2 px-3.5 text-xs border not-first:-ml-px`,
              {
                [`${toggleBtnSelected} border-sky-700`]: isSelected,
                "border-slate-700": !isSelected,
              },
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
