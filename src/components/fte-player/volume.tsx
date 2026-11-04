import { useFteController, useFtePolledValue } from "@/lib/fte/hooks";
import { VolumeSlider } from "./volume-slider";
import { VolumeToggle } from "./volume-toggle";

const hasDeviceVolume = window.matchMedia("(pointer: coarse)").matches;
const DEVICE_VOLUME_UNMUTE_FRACTION = 0.25;

export const Volume = () => {
  const fte = useFteController();
  const volume = useFtePolledValue("volume", () => fte?.getVolume() ?? 0);
  const isMuted = useFtePolledValue("volume", () => fte?.isMuted() ?? false);

  if (!fte) {
    return null;
  }

  function handleToggleClick() {
    if (!fte) {
      return;
    }

    if (hasDeviceVolume && fte.isMuted()) {
      fte.setVolume(fte.getMaxVolume() * DEVICE_VOLUME_UNMUTE_FRACTION);
    } else {
      fte.toggleMute();
    }
  }

  function handleVolumeChange(volume: number) {
    if (!fte) {
      return;
    }

    fte.setVolume(volume);
  }

  return (
    <>
      <VolumeToggle
        isEnabled={!isMuted}
        onClick={handleToggleClick}
        volume={volume}
      />
      {!hasDeviceVolume && (
        <VolumeSlider
          volume={volume}
          isMuted={isMuted}
          maxVolume={fte.getMaxVolume()}
          onChange={handleVolumeChange}
        />
      )}
    </>
  );
};
