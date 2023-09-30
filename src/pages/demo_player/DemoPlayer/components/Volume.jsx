import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeHigh,
  faVolumeLow,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

export const VolumeSlider = ({ volume, disabled, onChange }) => {
  function onChange_(e) {
    onChange(e.target.value);
  }

  return (
    <input
      type="range"
      style={{
        width: "6em",
        margin: "10px",
      }}
      className={classNames({ "opacity-40": disabled })}
      min="0"
      max="1"
      step="0.01"
      defaultValue={volume}
      disabled={disabled}
      onChange={onChange_}
    />
  );
};
export const VolumeToggle = ({ volume, isMuted, onClick }) => {
  return (
    <button className="w-12" title="Volume" onClick={onClick}>
      <FontAwesomeIcon icon={getVolumeIcon(volume, isMuted)} />
    </button>
  );
};
const getVolumeIcon = (volume, isMuted) => {
  if (isMuted) {
    return faVolumeMute;
  } else if (volume < 0.5) {
    return faVolumeLow;
  } else {
    return faVolumeHigh;
  }
};
