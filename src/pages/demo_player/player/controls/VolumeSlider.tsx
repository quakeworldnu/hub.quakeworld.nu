import { roundFloat } from "../../math.ts";
import classNames from "classnames";
import { useFteController, useFteUpdateOnEvent } from "../../fte/hooks.ts";

export const VolumeSlider = () => {
  useFteUpdateOnEvent("volume");

  const fte = useFteController();

  if (!fte) {
    return null;
  }

  const isMuted = fte.isMuted();
  const max = fte.maxVolume();
  const stepCount = 100;
  const stepSize = roundFloat(max / stepCount, 3);

  return (
    <input
      type="range"
      className={classNames({ grayscale: isMuted }, "w-24 mr-2")}
      min={0}
      max={max}
      step={stepSize}
      value={fte.volume()}
      onChange={(e) => fte.setVolume(e.target.value)}
    />
  );
};
