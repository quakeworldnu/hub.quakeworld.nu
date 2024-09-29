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

export function FteQtvPlayerControls() {
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
        "flex flex-wrap transition-opacity duration-200 bg-black/60 justify-between items-center sm:px-1 sm:gap-y-2",
        {
          "opacity-0": isIdle,
        },
      )}
    >
      <div className="flex items-center">
        <Volume />
      </div>

      <div className="flex items-center gap-x-2">
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
    <div className="text-xs sm:text-sm">
      <Switch
        label="Show servers (CTRL)"
        enabled={value}
        onClick={toggleQtvServerSelector}
      />
    </div>
  );
};
