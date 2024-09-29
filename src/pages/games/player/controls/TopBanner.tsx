import classNames from "classnames";
import { ReactNode } from "react";
import { useBoolean } from "usehooks-ts";
import { useFteEvent } from "../../fte/hooks.ts";

export const ResponsiveTopBanner = ({
  scale,
  children,
}: {
  scale: number;
  children?: ReactNode;
}) => {
  const { value: showscores, setTrue, setFalse } = useBoolean(false);
  useFteEvent("+showscores", setTrue);
  useFteEvent("-showscores", setFalse);

  return (
    <div
      className={classNames(
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
