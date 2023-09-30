import {
  Gametime,
  PlayToggleButton,
  SeekBar,
  VolumeSlider,
  VolumeToggle,
} from "@qwhub/pages/demo_player/DemoPlayer/components/controls";
import { useCounter, useEventListener, useInterval } from "usehooks-ts";

function useFteUpdateTriggers() {
  const { count, increment } = useCounter(0);
  useEventListener("fte.volume", increment);
  useEventListener("fte.mute", increment);
  useEventListener("fte.unmute", increment);
  useEventListener("fte.play", increment);
  useEventListener("fte.pause", increment);
  return count;
}

export const FteControls = ({ fte, duration }) => {
  useFteUpdateTriggers();

  if (!fte) {
    return null;
  }

  console.log("FteControls.RENDER");

  return (
    <>
      <SeekBar
        onChange={(v) => fte.demoJump(v)}
        max={duration}
        value={fte.getGametime()}
      />

      <PlayToggleButton
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
        onChange={(v) => fte.setVolume(v)}
      />

      <FteGametime fte={fte} duration={duration} />
    </>
  );
};

const FteGametime = ({ fte, duration }) => {
  const { increment } = useCounter(0);

  useInterval(increment, 1000);
  useEventListener("fte.demo_jump", increment);

  if (!fte) {
    return null;
  }

  return <Gametime total={duration} elapsed={fte.getGametime()} />;
};
