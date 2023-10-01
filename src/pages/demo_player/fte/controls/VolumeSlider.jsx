import { roundFloat } from "@qwhub/pages/demo_player/math";
import classNames from "classnames";

export const VolumeSlider = ({ volume, disabled, onChange, max }) => {
  function _onChange(e) {
    onChange(e.target.gametime);
  }

  const stepCount = 100;
  const stepSize = roundFloat(max / stepCount, 3);

  return (
    <input
      type="range"
      style={{
        width: "6em",
        margin: "10px",
      }}
      className={classNames({ "opacity-40": disabled })}
      min={0}
      max={max}
      step={stepSize}
      defaultValue={volume}
      disabled={disabled}
      onChange={_onChange}
    />
  );
};
