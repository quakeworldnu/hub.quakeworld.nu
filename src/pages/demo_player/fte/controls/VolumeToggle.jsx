import {
  faVolumeHigh,
  faVolumeLow,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import { IconToggleButton } from "@qwhub/pages/demo_player/fte/controls/IconToggleButton";

export const VolumeToggle = ({ volume, isMuted, onClick }) => {
  return (
    <IconToggleButton
      onClick={onClick}
      isEnabled={!isMuted}
      enabledIcon={volume < 0.1 ? faVolumeLow : faVolumeHigh}
      disabledIcon={faVolumeMute}
    />
  );
};
