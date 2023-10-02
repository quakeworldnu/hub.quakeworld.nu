import { AutotrackToggle } from "./controls/AutotrackToggle";
import { FullscreenToggle } from "./controls/FullscreenToggle";
import { PlayToggle } from "./controls/PlayToggle";
import { PlayerTrackButtons } from "./controls/PlayerTrackButtons";
import { SlowmotionToggle } from "./controls/SlowmotionToggle";
import { Time } from "./controls/Time";
import { TimeSlider } from "./controls/TimeSlider";
import { VolumeSlider } from "./controls/VolumeSlider";
import { VolumeToggle } from "./controls/VolumeToggle";
import { secondsToString } from "@qwhub/pages/demo_player/util";

export const Controls = ({ duration }) => {
  return (
    <>
      <TimeSlider max={duration} />
      <PlayToggle />
      <VolumeToggle />
      <VolumeSlider />
      <Time durationStr={secondsToString(duration)} />
      <div className="flex space-x-1 px-3 bg-black rounded-xl items-center text-sm">
        <AutotrackToggle />
        <PlayerTrackButtons />
      </div>
      <SlowmotionToggle />
      <FullscreenToggle />
    </>
  );
};
