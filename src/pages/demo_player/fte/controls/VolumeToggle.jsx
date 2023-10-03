import {
  faVolumeHigh,
  faVolumeLow,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import { IconToggleButton } from "@qwhub/pages/demo_player/fte/controls/IconToggleButton";
import {
  useFteController,
  useFteUpdateOnEvent,
} from "@qwhub/pages/demo_player/fte/hooks";

export const VolumeToggle = () => {
  useFteUpdateOnEvent("volume");
  const fte = useFteController();

  if (!fte) {
    return null;
  }

  return (
    <IconToggleButton
      onClick={() => fte.toggleMute()}
      isEnabled={!fte.isMuted()}
      enabledIcon={fte.volume() < 0.1 ? faVolumeLow : faVolumeHigh}
      disabledIcon={faVolumeMute}
    />
  );
};
