import {
  faVolumeHigh,
  faVolumeLow,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import { IconToggleButton } from "./IconButton.tsx";

type Props = {
  isEnabled: boolean;
  volume: number;
  onClick: () => void;
};

export const VolumeToggle = ({ isEnabled, onClick, volume }: Props) => {
  const icon = volume < 0.1 ? faVolumeLow : faVolumeHigh;
  return (
    <IconToggleButton
      onClick={onClick}
      isEnabled={isEnabled}
      enabledTitle={"Mute"}
      enabledIcon={icon}
      disabledTitle={"Unmute"}
      disabledIcon={faVolumeMute}
    />
  );
};
