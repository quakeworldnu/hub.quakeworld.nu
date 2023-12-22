import {
  faVolumeHigh,
  faVolumeLow,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import { IconToggleButton } from "./IconButton.tsx";
import { useFteController, useFteUpdateOnEvent } from "../../fte/hooks.ts";

export const VolumeToggle = () => {
  useFteUpdateOnEvent("volume");
  const fte = useFteController();

  function handleClick() {
    if (!fte) {
      return;
    }

    fte.toggleMute();
  }

  if (!fte) {
    return null;
  }

  return (
    <IconToggleButton
      onClick={handleClick}
      isEnabled={!fte.isMuted()}
      enabledTitle={"Mute"}
      enabledIcon={fte.getVolume() < 0.1 ? faVolumeLow : faVolumeHigh}
      disabledTitle={"Unmute"}
      disabledIcon={faVolumeMute}
    />
  );
};
