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
import { TimeSlider } from "./controls/TimeSlider.tsx";
import { Volume } from "./controls/Volume.tsx";

export const Controls = () => {
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
        "flex flex-wrap transition-opacity duration-200 bg-black/60 justify-between items-center sm:px-1",
        {
          "opacity-0": !showClipEditor && isIdle,
        },
      )}
    >
      <div className="w-full mx-2">
        <TimeSlider />
      </div>

      <div className="flex items-center">
        <Volume />
        <GameClock />
      </div>

      <div className="hidden sm:flex gap-x-1 mb-2">
        <SeekToStartButton />
        <PlayToggle />
        <SeekToEndButton />
      </div>

      <div className="sm:flex gap-x-1">
        <AutotrackToggle />
        <div className="hidden sm:block">
          <SlowmotionToggle />
        </div>
        <div className="hidden sm:block">
          <FullscreenToggle />
        </div>
      </div>
    </div>
  );
};
