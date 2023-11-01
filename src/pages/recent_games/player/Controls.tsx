import { AutotrackToggle } from "./controls/AutotrackToggle.tsx";
import { FullscreenToggle } from "./controls/FullscreenToggle.tsx";
import { PlayToggle } from "./controls/PlayToggle.tsx";
import { PlayerTrackButtons } from "./controls/PlayerTrackButtons.tsx";
import { SlowmotionToggle } from "./controls/SlowmotionToggle.tsx";
import { GameClock } from "./controls/GameClock.tsx";
import { TimeSlider } from "./controls/TimeSlider.tsx";
import { VolumeSlider } from "./controls/VolumeSlider.tsx";
import { VolumeToggle } from "./controls/VolumeToggle.tsx";
import { SplitscreenToggle } from "./controls/SplitscreenToggle.tsx";
import { useIdle } from "@uidotdev/usehooks";
import classNames from "classnames";
import { useClipEditor } from "./clips/context.tsx";
import { SeekToEndButton } from "./controls/SeekToEndButton.tsx";
import { SeekToStartButton } from "./controls/SeekToStartButton.tsx";

export const Controls = () => {
  const { isEnabled: showClipEditor } = useClipEditor();
  const idle = useIdle(showClipEditor ? undefined : 2500);

  return (
    <div
      className={classNames(
        "flex flex-wrap transition-opacity duration-500 bg-black/60 justify-between",
        {
          "opacity-0z": idle,
        },
      )}
    >
      <div className="w-full mx-4">
        <TimeSlider />
      </div>

      <div className="flex space-x-1 items-center">
        <VolumeToggle />
        <VolumeSlider />
        <GameClock />
      </div>

      <div className="flex w-56 space-x-1 items-center justify-center">
        <SeekToStartButton />
        <PlayToggle />
        <SeekToEndButton />
      </div>

      <div className="flex space-x-1 items-center">
        {false && <AutotrackToggle />}
        {false && <PlayerTrackButtons />}
        {false && <div className="w-12"></div>}
        <SlowmotionToggle />
        <SplitscreenToggle />
        <FullscreenToggle />
      </div>
    </div>
  );
};
