import { useCounter, useEventListener } from "usehooks-ts";
import { secondsToString } from "./time";
import screenfull from "screenfull";
import { toggleFullscreen } from "./player";
import { VolumeSlider } from "./controls/VolumeSlider";
import { VolumeToggle } from "./controls/VolumeToggle";
import { TimeSlider } from "./controls/TimeSlider";
import { SlowmotionToggle } from "./controls/SlowmotionToggle";
import { PlayToggle } from "./controls/PlayToggle";
import { FullscreenToggle } from "./controls/FullscreenToggle";
import { Track } from "./controls/Track";
import { Time } from "./controls/Time";

function useFteUpdateTriggers() {
  const { count, increment } = useCounter(0);
  useEventListener("fte.volume", increment);
  useEventListener("fte.mute", increment);
  useEventListener("fte.unmute", increment);
  useEventListener("fte.play", increment);
  useEventListener("fte.pause", increment);
  useEventListener("fte.track", increment);
  useEventListener("fte.demo_setspeed", increment);
  return count;
}

export const Controls = ({ fte, duration }) => {
  useFteUpdateTriggers();

  if (!fte) {
    return null;
  }

  console.log("FteControls.RENDER");

  return (
    <>
      <TimeSlider
        onChange={(v) => fte.demoJump(v)}
        max={duration}
        getGametime={() => fte.getGametime()}
      />

      <PlayToggle
        onClick={() => fte.togglePlay()}
        isPlaying={fte.isPlaying()}
      />

      <VolumeToggle
        volume={fte.volume()}
        isMuted={fte.isMuted()}
        onClick={() => fte.toggleMute()}
      />

      <VolumeSlider
        volume={fte.volume()}
        disabled={fte.isMuted()}
        max={0.2}
        onChange={(v) => fte.setVolume(v)}
      />

      <Time
        getGametime={() => fte.getGametime()}
        durationStr={secondsToString(duration)}
      />

      <Track
        players={fte.getPlayers()}
        onClick={(playerId) => fte.track(playerId)}
        getTrackUserid={() => fte.getTrackUserid()}
      />

      <div className="ml-auto">
        <SlowmotionToggle
          onChange={(speed) => fte.setSpeed(speed)}
          currentSpeed={fte.speed()}
        />
        <FullscreenToggle
          onClick={toggleFullscreen}
          isFullscreen={screenfull.isFullscreen}
        />
      </div>
    </>
  );
};
