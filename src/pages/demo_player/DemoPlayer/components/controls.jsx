import { secondsToString } from "@qwhub/pages/demo_player/DemoPlayer/components/time";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Slider from "@radix-ui/react-slider";
import { useMouse } from "@uidotdev/usehooks";
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
import { useEffect, useRef } from "react";
import { useHover } from "usehooks-ts";

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

export function SeekBar({ onChange, max, value }) {
  const sliderWrapperRef = useRef(null);
  const tooltipRef = useRef(null);
  const isHover = useHover(sliderWrapperRef);
  const [mouse, sliderRootRef] = useMouse();

  function onValueCommit(values) {
    if (values.length > 0) {
      onChange(values[0]);
    }
  }

  useEffect(() => {
    if (!isHover) {
      return;
    }

    const sliderWidth = sliderRootRef.current.getBoundingClientRect().width;
    const progress = mouse.elementX / sliderWidth;
    tooltipRef.current.textContent = secondsToString(
      Math.round(progress * max),
    );
    tooltipRef.current.style.left = `${mouse.elementX - 10}px`; // -10 to center tooltip
  }, [isHover, mouse.elementX]);

  return (
    <div className="w-full mx-4">
      <div
        className={classNames(
          { hidden: !isHover },
          "absolute bottom-20 text-xs font-mono px-2 py-1 bg-purple-800 text-white rounded",
        )}
        ref={tooltipRef}
      ></div>
      <div className="w-full" ref={sliderWrapperRef}>
        <form>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8 group cursor-pointer transition-colors"
            defaultValue={[value]}
            onValueCommit={onValueCommit}
            max={max}
            step={1}
            ref={sliderRootRef}
          >
            <Slider.Track className="bg-gray-500 group-hover:bg-gray-400 relative grow h-1 group-hover:h-1.5">
              <Slider.Range className="absolute bg-purple-800 group-hover:bg-purple-700 h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-1 h-1 bg-purple-800 group-hover:bg-purple-600 rounded-full group-hover:w-4 group-hover:h-4 focus:outline-none transition-size duration-100"
              aria-label="Seek"
            />
          </Slider.Root>
        </form>
      </div>
    </div>
  );
}

export const VolumeSlider = ({ volume, disabled, onChange }) => {
  function _onChange(e) {
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
      min={0}
      max={1}
      step={0.01}
      defaultValue={volume}
      disabled={disabled}
      onChange={_onChange}
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
