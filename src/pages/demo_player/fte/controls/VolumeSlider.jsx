import { roundFloat } from "@qwhub/pages/demo_player/math";
import classNames from "classnames";
import {
  useFteController,
  useFteUpdateOnEvent,
} from "@qwhub/pages/demo_player/fte/hooks";

export const VolumeSlider = () => {
  useFteUpdateOnEvent("volume");

  const fte = useFteController();

  if (!fte) {
    return null;
  }

  const isMuted = fte.isMuted();
  const stepCount = 100;
  const stepSize = roundFloat(max / stepCount, 3);

  return (
    <input
      type="range"
      style={{
        width: "6em",
        margin: "10px",
      }}
      className={classNames({ grayscale: isMuted })}
      min={0}
      max={fte.maxVolume()}
      step={stepSize}
      defaultValue={fte.volume()}
      onChange={(e) => fte.setVolume(e.target.value)}
    />
  );
};
