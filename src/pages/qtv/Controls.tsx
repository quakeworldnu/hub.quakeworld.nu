import { useEventListener } from "@qwhub/pages/games/hooks.ts";
import { AutotrackToggle } from "@qwhub/pages/games/player/controls/AutotrackToggle.tsx";
import { FullscreenToggle } from "@qwhub/pages/games/player/controls/FullscreenToggle.tsx";
import { Volume } from "@qwhub/pages/games/player/controls/Volume.tsx";
import { Switch } from "@qwhub/pages/games/ui/Switch.tsx";
import {
  QtvEvent,
  hideQtvServerSelector,
  toggleQtvServerSelector,
} from "@qwhub/pages/qtv/events.ts";
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
      <div className="flex w-auto sm:w-1/3 sm:space-x-2 items-center">
        <Volume />
      </div>

      <div className="flex w-auto sm:w-2/3 space-x-2 items-center justify-end">
        <div className="hidden sm:block">
          <QtvServerTilesToggle />
        </div>
        <AutotrackToggle />
        <div className="hidden sm:block">
          <FullscreenToggle />
        </div>
      </div>
    </div>
  );
}

export const QtvServerTilesToggle = ({
  defaultVisible = false,
}: { defaultVisible?: boolean }) => {
  const { value, setFalse, setTrue } = useBoolean(defaultVisible);
  useEventListener(QtvEvent.SelectServer, hideQtvServerSelector);
  useEventListener(QtvEvent.HideServerSelector, setFalse);
  useEventListener(QtvEvent.ShowServerSelector, setTrue);

  return (
    <div className="px-3 text-sm">
      <Switch
        label="Show servers"
        enabled={value}
        onClick={toggleQtvServerSelector}
      />
    </div>
  );
};
