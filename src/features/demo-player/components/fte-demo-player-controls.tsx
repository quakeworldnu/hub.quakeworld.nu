import clsx from "clsx";
import { useBoolean, useEventListener } from "usehooks-ts";
import { AutotrackToggle } from "@/components/fte-player/autotrack-toggle";
import { ConsoleToggle } from "@/components/fte-player/console-toggle";
import {
  FullscreenToggle,
  FullWindowToggle,
} from "@/components/fte-player/fullscreen-toggle";
import { GameDuration } from "@/components/fte-player/game-clock";
import { MinimapToggle } from "@/components/fte-player/minimap-toggle";
import { SettingsToggle } from "@/components/fte-player/settings";
import { Volume } from "@/components/fte-player/volume";
import { useClipEditor } from "@/features/demo-player/clips/clip-editor";
import { useUpdateInterval } from "@/hooks/use-update-interval";
import { useFteController } from "@/lib/fte/hooks";
import { AutoplayToggle } from "./autoplay-toggle";
import { PlayToggle } from "./play-toggle";
import { SeekToEndButton } from "./seek-to-end-button";
import { SeekToStartButton } from "./seek-to-start-button";
import { SlowmotionToggle } from "./slowmotion-toggle";
import { TimeSlider } from "./time-slider";

// single row at every width: phones (below sm) get the essentials (no game duration, the
// engine draws a game clock), keyboard/power-user toggles (minimap, console, slowmotion) wait for lg
export const FteDemoPlayerControls = () => {
  const { isEnabled: showClipEditor } = useClipEditor();
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
        "flex flex-wrap sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] transition-opacity duration-200 bg-black/60 justify-between items-center sm:px-1",
        {
          "opacity-0": !showClipEditor && isIdle,
        },
      )}
    >
      <div className="w-full mx-2 sm:col-span-3 sm:w-auto">
        <TimeSlider />
      </div>

      <div className="flex items-center sm:justify-self-start">
        <Volume />
        <div className="hidden sm:block">
          <DemoPlayerGameDuration />
        </div>
      </div>

      <div className="flex gap-x-1 sm:mb-2 relative">
        <div className="hidden sm:block">
          <SeekToStartButton />
        </div>
        <PlayToggle />
        <div className="hidden sm:block">
          <SeekToEndButton />
        </div>
        {/* positioned outside the flow to keep the playback buttons centered */}
        <div className="absolute left-full top-0 h-10 hidden xl:flex items-center whitespace-nowrap">
          <AutoplayToggle />
        </div>
      </div>

      <div className="flex flex-wrap justify-end sm:justify-self-end gap-x-1">
        <div className="hidden sm:block">
          <AutotrackToggle />
        </div>
        <div className="hidden lg:block">
          <MinimapToggle />
        </div>
        <div className="hidden lg:block">
          <ConsoleToggle />
        </div>
        <div className="hidden lg:block">
          <SlowmotionToggle />
        </div>
        <SettingsToggle />
        <FullWindowToggle />
        <div className="hidden sm:block">
          <FullscreenToggle />
        </div>
      </div>
    </div>
  );
};

export const DemoPlayerGameDuration = () => {
  const fte = useFteController();
  useUpdateInterval(fte ? 200 : null);

  if (!fte) {
    return null;
  }

  return (
    <GameDuration
      elapsed={fte.getMatchElapsedTime()}
      total={fte.getMatchDuration()}
    />
  );
};
