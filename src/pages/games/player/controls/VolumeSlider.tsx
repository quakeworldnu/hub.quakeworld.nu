import { roundFloat } from "../../math.ts";
import classNames from "classnames";
import { ChangeEvent } from "react";

type Props = {
  isMuted: boolean;
  volume: number;
  maxVolume: number;
  onChange: (volume: number) => void;
};

export const VolumeSlider = ({
  isMuted,
  volume,
  maxVolume,
  onChange,
}: Props) => {
  const stepCount = 100;
  const stepSize = roundFloat(maxVolume / stepCount, 3);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(Number(e.target.value));
  }

  return (
    <input
      type="range"
      className={classNames({ grayscale: isMuted }, "w-16 sm:w-24 mr-2")}
      min={0}
      max={maxVolume}
      step={stepSize}
      value={volume}
      onChange={handleChange}
    />
  );
};
