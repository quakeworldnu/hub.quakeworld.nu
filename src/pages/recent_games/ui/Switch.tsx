import * as RadixSwitch from "@radix-ui/react-switch";
import classNames from "classnames";

type Props = {
  label: string;
  enabled: boolean;
  onClick: () => void;
};

export const Switch = ({ label, enabled, onClick }: Props) => {
  return (
    <form>
      <div className="flex items-center cursor-pointer">
        <label
          className={classNames("pr-2 cursor-pointer select-none", {
            "text-gray-300": !enabled,
            "font-bold": enabled,
          })}
          htmlFor={label}
        >
          {label}
        </label>
        <RadixSwitch.Root
          onClick={() => onClick()}
          className={classNames(
            "w-10 h-5 rounded-full relative focus:shadow-black outline-none",
            {
              "bg-blue-400": enabled,
              "bg-gray-500": !enabled,
            },
          )}
          id={label}
        >
          <RadixSwitch.Thumb
            className={classNames(
              "block w-4 h-4 rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform",
              {
                "translate-x-[22px] bg-blue-800": enabled,
                "bg-gray-700": !enabled,
              },
            )}
          />
        </RadixSwitch.Root>
      </div>
    </form>
  );
};
