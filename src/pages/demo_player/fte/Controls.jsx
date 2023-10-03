import { AutotrackToggle } from "./controls/AutotrackToggle";
import { FullscreenToggle } from "./controls/FullscreenToggle";
import { PlayToggle } from "./controls/PlayToggle";
import { PlayerTrackButtons } from "./controls/PlayerTrackButtons";
import { SlowmotionToggle } from "./controls/SlowmotionToggle";
import { Clock } from "./controls/Clock";
import { TimeSlider } from "./controls/TimeSlider";
import { VolumeSlider } from "./controls/VolumeSlider";
import { VolumeToggle } from "./controls/VolumeToggle";

export const Controls = () => {
  return (
    <>
      <TimeSlider />
      <PlayToggle />
      <VolumeToggle />
      <VolumeSlider />
      <Clock />
      <div className="flex space-x-1 px-3 bg-black rounded-xl items-center text-sm">
        <AutotrackToggle />
        <PlayerTrackButtons />
      </div>
      <SlowmotionToggle />
      <FullscreenToggle />
    </>
  );
};
