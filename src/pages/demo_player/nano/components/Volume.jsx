import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeHigh,
  faVolumeLow,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";

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
      min="0"
      max="1"
      step="0.01"
      defaultValue={volume}
      disabled={disabled}
      onChange={onChange_}
    />
  );
};
export const VolumeToggle = ({ volume, isMuted, onChange }) => {
  function onClick() {
    onChange(!isMuted);
  }

  return (
    <button
      style={{
        width: "3em",
        border: "none",
        padding: "10px",
      }}
      title="Volume"
      onClick={onClick}
    >
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
