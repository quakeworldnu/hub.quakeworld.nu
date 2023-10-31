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
import { useClipEditor } from "./Clips.tsx";
import { ClipControls } from "./ClipControls.tsx";

export const Controls = () => {
  const { isEnabled: showClipEditor } = useClipEditor();
  const idle = useIdle(showClipEditor ? undefined : 2500);

  return (
    <div
      className={classNames(
        "flex flex-wrap transition-opacity duration-500 bg-black/60",
        {
          "opacity-0": idle,
        },
      )}
    >
      <div className="w-full mx-4">
        <TimeSlider />
        {showClipEditor && <ClipControls />}
      </div>

      <PlayToggle />
      <VolumeToggle />
      <VolumeSlider />
      <GameClock />
      <div className="flex space-x-1 px-3 bg-black rounded-xl items-center text-sm">
        <AutotrackToggle />
        <PlayerTrackButtons />
      </div>
      <SlowmotionToggle />
      <SplitscreenToggle />
      <FullscreenToggle />
    </div>
  );
};
