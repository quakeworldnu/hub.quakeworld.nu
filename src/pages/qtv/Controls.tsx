import { useEventListener } from "@qwhub/pages/games/hooks.ts";
import { AutotrackToggle } from "@qwhub/pages/games/player/controls/AutotrackToggle.tsx";
import { FullscreenToggle } from "@qwhub/pages/games/player/controls/FullscreenToggle.tsx";
import { Volume } from "@qwhub/pages/games/player/controls/Volume.tsx";
import classNames from "classnames";
import { useBoolean } from "usehooks-ts";

export function Controls() {
  const {
    value: isIdle,
    setTrue: setIsIdle,
    setFalse: setIsActive,
  } = useBoolean(false);

  useEventListener("fteplayer.mouse.idle", setIsIdle);
  useEventListener("fteplayer.mouse.active", setIsActive);

  return (
    <div
      className={classNames(
        "flex flex-wrap h-12 transition-opacity duration-200 bg-black/60 justify-between px-2",
        {
          "opacity-0": isIdle,
        },
      )}
    >
      <div className="flex w-full sm:w-1/3 sm:space-x-2 items-center">
        <Volume />
      </div>

      <div className="hidden sm:flex w-1/3 space-x-2 items-center justify-end ">
        <AutotrackToggle />
        <FullscreenToggle />
      </div>
    </div>
  );
}
