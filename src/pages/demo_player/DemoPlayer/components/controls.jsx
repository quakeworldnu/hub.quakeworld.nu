import { secondsToString } from "@qwhub/pages/demo_player/DemoPlayer/components/time";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faGauge,
  faMinimize,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

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
