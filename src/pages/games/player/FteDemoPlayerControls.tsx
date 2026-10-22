import { useFteController } from "@qwhub/pages/games/fte/hooks.ts";
import { GameDuration } from "@qwhub/pages/games/player/controls/GameClock.tsx";
import { XrayToggle } from "@qwhub/pages/games/player/controls/XrayToggle.tsx";
import classNames from "classnames";
import { useBoolean } from "usehooks-ts";
import { useEventListener, useUpdateInterval } from "../hooks.ts";
import { useClipEditor } from "./clips/context.tsx";
import { AutoplayToggle } from "./controls/AutoplayToggle.tsx";
import { AutotrackToggle } from "./controls/AutotrackToggle.tsx";
import { ConsoleToggle } from "./controls/ConsoleToggle.tsx";
import { FullscreenToggle } from "./controls/FullscreenToggle.tsx";
import { PlayToggle } from "./controls/PlayToggle.tsx";
import { SeekToEndButton } from "./controls/SeekToEndButton.tsx";
import { SeekToStartButton } from "./controls/SeekToStartButton.tsx";
import { SlowmotionToggle } from "./controls/SlowmotionToggle.tsx";
import { TimeSlider } from "./controls/TimeSlider.tsx";
import { Volume } from "./controls/Volume.tsx";

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
      className={classNames(
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
        <DemoPlayerGameDuration />
      </div>

      <div className="hidden sm:flex gap-x-1 mb-2 relative">
        <SeekToStartButton />
        <PlayToggle />
        <SeekToEndButton />
        {/* positioned outside the flow to keep the playback buttons centered */}
        <div className="absolute left-full top-0 h-10 hidden xl:flex items-center whitespace-nowrap">
          <AutoplayToggle />
        </div>
      </div>

      <div className="sm:flex sm:flex-wrap sm:justify-end sm:justify-self-end gap-x-1">
        <XrayToggle />
        <AutotrackToggle />
        <div className="hidden sm:block">
          <SlowmotionToggle />
        </div>
        <ConsoleToggle />
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
