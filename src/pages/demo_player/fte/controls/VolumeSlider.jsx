import { roundFloat } from "@qwhub/pages/demo_player/math";
import classNames from "classnames";
import {
  useFteController,
  useFteUpdateOnEvent,
} from "@qwhub/pages/demo_player/fte/hooks";

const max = 0.2;
const stepCount = 100;
const stepSize = roundFloat(max / stepCount, 3);

export const VolumeSlider = () => {
  useFteUpdateOnEvent("mute");
  useFteUpdateOnEvent("unmute");
  useFteUpdateOnEvent("volume");

  const fte = useFteController();

  if (!fte) {
    return null;
  }

  return (
    <input
      type="range"
      style={{
        width: "6em",
        margin: "10px",
      }}
      className={classNames({ "opacity-40": !fte.isMuted() })}
      min={0}
      max={0.2}
      step={stepSize}
      defaultValue={fte.volume()}
      disabled={fte.isMuted()}
      onChange={(e) => fte.setVolume(e.target.value)}
    />
  );
};
