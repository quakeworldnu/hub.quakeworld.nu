import classNames from "classnames";
import { useBoolean } from "usehooks-ts";
import { AutotrackToggle } from "./controls/AutotrackToggle.tsx";
import { FullscreenToggle } from "./controls/FullscreenToggle.tsx";
import { PlayToggle } from "./controls/PlayToggle.tsx";
import { SlowmotionToggle } from "./controls/SlowmotionToggle.tsx";
import { GameClock } from "./controls/GameClock.tsx";
import { TimeSlider } from "./controls/TimeSlider.tsx";
import { VolumeSlider } from "./controls/VolumeSlider.tsx";
import { VolumeToggle } from "./controls/VolumeToggle.tsx";
import { SplitscreenToggle } from "./controls/SplitscreenToggle.tsx";
import { useClipEditor } from "./clips/context.tsx";
import { SeekToEndButton } from "./controls/SeekToEndButton.tsx";
import { SeekToStartButton } from "./controls/SeekToStartButton.tsx";
import { useEventListener } from "../hooks.ts";

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
        "flex flex-wrap transition-opacity duration-500 bg-black/60 justify-between px-4",
        {
          "opacity-0": !showClipEditor && isIdle,
        },
      )}
    >
      <div className="w-full justify-end">
        <TimeSlider />
      </div>

      <div className="flex w-1/4 space-x-2 items-center my-2">
        <VolumeToggle />
        <VolumeSlider />
        <GameClock />
      </div>

      <div className="flex space-x-2 items-center justify-center my-2">
        <SeekToStartButton />
        <PlayToggle />
        <SeekToEndButton />
      </div>

      <div className="flex w-1/4 space-x-2 items-center justify-end my-2">
        <AutotrackToggle />
        <SlowmotionToggle />
        <SplitscreenToggle />
        <FullscreenToggle />
      </div>
    </div>
  );
};
