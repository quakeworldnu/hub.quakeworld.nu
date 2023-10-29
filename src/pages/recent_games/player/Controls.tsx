import { AutotrackToggle } from "./controls/AutotrackToggle.tsx";
import { FullscreenToggle } from "./controls/FullscreenToggle.tsx";
import { PlayToggle } from "./controls/PlayToggle.tsx";
import { PlayerTrackButtons } from "./controls/PlayerTrackButtons.tsx";
import { SlowmotionToggle } from "./controls/SlowmotionToggle.tsx";
import { GameClock } from "./controls/GameClock.tsx";
import { TimeSlider } from "./controls/TimeSlider.tsx";
import { VolumeSlider } from "./controls/VolumeSlider.tsx";
import { VolumeToggle } from "./controls/VolumeToggle.tsx";
import { GroupControls } from "./GroupControls.tsx";
import { SplitscreenToggle } from "./controls/SplitscreenToggle.tsx";
import { useIdle } from "@uidotdev/usehooks";
import classNames from "classnames";
import { ClipTimeSlider } from "./ClipTimeSlider.tsx";
import { useClipEditor } from "./Clips.tsx";

export const Controls = () => {
  // const { group } = useUser();
  const { isEnabled } = useClipEditor();
  const group = false;
  const idle = useIdle(5000000);

  return (
    <div
      className={classNames(
        "flex flex-wrap transition-opacity duration-500 bg-black/60",
        {
          "opacity-0": idle,
        },
      )}
    >
      {false && group && <GroupControls />}

      <div className="w-full mx-4">
        <TimeSlider />
        {isEnabled && <ClipTimeSlider />}
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
