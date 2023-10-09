import { AutotrackToggle } from "./controls/AutotrackToggle";
import { FullscreenToggle } from "./controls/FullscreenToggle";
import { PlayToggle } from "./controls/PlayToggle";
import { PlayerTrackButtons } from "./controls/PlayerTrackButtons";
import { SlowmotionToggle } from "./controls/SlowmotionToggle";
import { GameClock } from "./controls/GameClock";
import { TimeSlider } from "./controls/TimeSlider";
import { VolumeSlider } from "./controls/VolumeSlider";
import { VolumeToggle } from "./controls/VolumeToggle";
import { useUser } from "../services/convex/hooks";
import { GroupControls } from "@qwhub/pages/demo_player/fte/GroupControls";
import { SplitscreenToggle } from "@qwhub/pages/demo_player/fte/controls/SplitscreenToggle";

export const Controls = () => {
  const { group } = useUser();

  return (
    <div className="flex flex-wrap">
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
