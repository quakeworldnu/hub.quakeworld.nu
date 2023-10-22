import { AutotrackToggle } from "./controls/AutotrackToggle.tsx";
import { FullscreenToggle } from "./controls/FullscreenToggle.tsx";
import { PlayToggle } from "./controls/PlayToggle.tsx";
import { PlayerTrackButtons } from "./controls/PlayerTrackButtons.tsx";
import { SlowmotionToggle } from "./controls/SlowmotionToggle.tsx";
import { GameClock } from "./controls/GameClock.tsx";
import { TimeSlider } from "./controls/TimeSlider.tsx";
import { VolumeSlider } from "./controls/VolumeSlider.tsx";
import { VolumeToggle } from "./controls/VolumeToggle.tsx";
import { useUser } from "../services/convex/hooks";
import { GroupControls } from "./GroupControls";
import { SplitscreenToggle } from "./controls/SplitscreenToggle";
import { useIdle } from "@uidotdev/usehooks";
import classNames from "classnames";

export const Controls = () => {
  const { group } = useUser();
  const idle = useIdle(2500);

  return (
    <div
      className={classNames(
        "flex flex-wrap transition-opacity duration-500 bg-black/60",
        {
          "opacity-0": idle,
        },
      )}
    >
      {group && <GroupControls />}
      <TimeSlider />
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
