import {
  faVolumeHigh,
  faVolumeLow,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import { IconToggleButton } from "./IconToggleButton.tsx";
import { useFteController, useFteUpdateOnEvent } from "../hooks.ts";

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
