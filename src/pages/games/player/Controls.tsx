import classNames from "classnames";
import { useBoolean } from "usehooks-ts";
import { useEventListener } from "../hooks.ts";
import { useClipEditor } from "./clips/context.tsx";
import { AutotrackToggle } from "./controls/AutotrackToggle.tsx";
import { FullscreenToggle } from "./controls/FullscreenToggle.tsx";
import { GameClock } from "./controls/GameClock.tsx";
import { PlayToggle } from "./controls/PlayToggle.tsx";
import { SeekToEndButton } from "./controls/SeekToEndButton.tsx";
import { SeekToStartButton } from "./controls/SeekToStartButton.tsx";
import { SlowmotionToggle } from "./controls/SlowmotionToggle.tsx";
import { SplitscreenToggle } from "./controls/SplitscreenToggle.tsx";
import { TimeSlider } from "./controls/TimeSlider.tsx";
import { Volume } from "./controls/Volume.tsx";

export const Controls = () => {
  const { isEnabled: showClipEditor } = useClipEditor();
  const {
    value: isIdle,
    setTrue: setIsIdle,
    setFalse: setIsActive,
  } = useBoolean(false);

  useEventListener("demoplayer.mouse.idle", setIsIdle);
  useEventListener("demoplayer.mouse.active", setIsActive);

  return (
    <div
      className={classNames(
        "flex flex-wrap transition-opacity duration-500 bg-black/60 justify-between px-2 sm:px-4",
        {
          "opacity-0": !showClipEditor && isIdle,
        },
      )}
    >
      <div className="w-full justify-end">
        <TimeSlider />
      </div>

      <div className="flex w-full sm:w-1/3 sm:space-x-2 items-center mb-1 sm:mb-2">
        <Volume />
        <GameClock />
      </div>

      <div className="hidden sm:flex space-x-1 items-center justify-center mb-2">
        <SeekToStartButton />
        <PlayToggle />
        <SeekToEndButton />
      </div>

      <div className="hidden sm:flex w-1/3 space-x-2 items-center justify-end mb-2 ">
        <AutotrackToggle />
        <SlowmotionToggle />
        <SplitscreenToggle />
        <FullscreenToggle />
      </div>
    </div>
  );
};
