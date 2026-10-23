import * as RadixSwitch from "@radix-ui/react-switch";
import clsx from "clsx";
import type { ReactNode } from "react";

type Props = {
  label: ReactNode;
  enabled: boolean;
  onClick: () => void;
  title?: string;
};

export const Switch = ({ label, enabled, onClick, title }: Props) => {
  return (
    <div
      className="flex items-center cursor-pointer p-2 text-xs sm:text-sm"
      onClick={onClick}
      title={title}
    >
      <span
        className={clsx("pr-2 select-none", {
          "text-gray-300": !enabled,
          "font-bold": enabled,
        })}
      >
        {label}
      </span>
      <RadixSwitch.Root
        className={clsx(
          "w-10 h-5 rounded-full relative focus:shadow-black outline-hidden",
          {
            "bg-blue-400": enabled,
            "bg-gray-500": !enabled,
          },
        )}
        id={typeof label === "string" ? label : undefined}
      >
        <RadixSwitch.Thumb
          className={clsx(
            "block w-4 h-4 rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform",
            {
              "translate-x-[22px] bg-blue-800": enabled,
              "bg-gray-700": !enabled,
            },
          )}
        />
      </RadixSwitch.Root>
    </div>
  );
};
