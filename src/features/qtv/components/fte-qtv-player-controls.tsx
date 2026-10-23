import clsx from "clsx";
import { useBoolean } from "usehooks-ts";
import { AutotrackToggle } from "@/components/fte-player/autotrack-toggle";
import { ConsoleToggle } from "@/components/fte-player/console-toggle";
import { FullscreenToggle } from "@/components/fte-player/fullscreen-toggle";
import { Volume } from "@/components/fte-player/volume";
import { XrayToggle } from "@/components/fte-player/xray-toggle";
import { Switch } from "@/components/ui/switch";
import {
  hideQtvServerSelector,
  QtvEvent,
  toggleQtvServerSelector,
} from "@/features/qtv/events";
import { useEventListener } from "@/hooks/use-event-listener";
import { PopoutButton } from "./popout-button";

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
      className={clsx(
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
        <XrayToggle />
        <AutotrackToggle />
        <ConsoleToggle />
        <PopoutButton />

        <div className="hidden sm:block">
          <FullscreenToggle />
        </div>
      </div>
    </div>
  );
}

export const QtvServerTilesToggle = ({
  defaultVisible = false,
}: {
  defaultVisible?: boolean;
}) => {
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
