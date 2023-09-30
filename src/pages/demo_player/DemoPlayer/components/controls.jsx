import { secondsToString } from "@qwhub/pages/demo_player/DemoPlayer/components/time";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Slider from "@radix-ui/react-slider";
import {
  faExpand,
  faGauge,
  faMinimize,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeLow,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

export const GameTime = ({ total, elapsed }) => {
  return (
    <div className="flex mr-auto font-mono items-center">
      {secondsToString(elapsed)} / {secondsToString(total)}
    </div>
  );
};
export const PlayToggleButton = ({ isPlaying, onClick }) => {
  return (
    <button className="w-12 py-2" title="Play" onClick={onClick}>
      <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
    </button>
  );
};
export const ToggleSlowMotionButton = ({ onClick }) => {
  return (
    <button className={"w-12"} onClick={onClick}>
      <FontAwesomeIcon icon={faGauge} />
    </button>
  );
};
export const ToggleFullscreenButton = ({ onClick, isFullscreen }) => {
  return (
    <button className={"w-12"} onClick={onClick}>
      <FontAwesomeIcon icon={isFullscreen ? faMinimize : faExpand} />
    </button>
  );
};

export function SeekBar({ onClick, max, value }) {
  const onValueCommit = (values) => {
    if (values.length > 0) {
      onClick(values[0]);
    }
  };

  return (
    <div className="flex w-full">
      <form className="flex w-full mx-4">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-8 group cursor-pointer transition-colors"
          defaultValue={[value]}
          onValueCommit={onValueCommit}
          max={max}
          step={1}
        >
          <Slider.Track className="bg-gray-500 group-hover:bg-gray-400 relative grow h-1 group-hover:h-1.5 rounded">
            <Slider.Range className="absolute bg-purple-800 group-hover:bg-purple-700 h-full rounded" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-1 h-1 bg-purple-800 group-hover:bg-purple-700 rounded-full group-hover:w-4 group-hover:h-4 focus:outline-none transition-size duration-100"
            aria-label="Seek"
          />
        </Slider.Root>
      </form>
    </div>
  );
}

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
