import clsx from "clsx";
import type { ReactNode } from "react";
import { useBoolean } from "usehooks-ts";
import { useFteEvent } from "@/lib/fte/hooks";

export const ResponsiveTopBanner = ({
  scale,
  children,
}: {
  scale: number;
  children?: ReactNode;
}) => {
  const { value: showscores, setTrue, setFalse, toggle } = useBoolean(false);
  useFteEvent("+showscores", setTrue);
  useFteEvent("-showscores", setFalse);
  useFteEvent("toggleconsole", toggle);

  return (
    <div
      className={clsx(
        "absolute left-0 right-0 mx-auto origin-top w-px top-[3%] pointer-events-none",
        {
          hidden: showscores,
        },
      )}
      style={{ transform: `scale(${scale})` }}
    >
      <div className="flex flex-col items-center pointer-events-none select-none text-nowrap space-y-1">
        {children}
      </div>
    </div>
  );
};
