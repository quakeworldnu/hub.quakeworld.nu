import { useFteController, useFtePolledValue } from "@/lib/fte/hooks";
import { VolumeSlider } from "./volume-slider";
import { VolumeToggle } from "./volume-toggle";

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

    fte.toggleMute();
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
      <VolumeSlider
        volume={volume}
        isMuted={isMuted}
        maxVolume={fte.getMaxVolume()}
        onChange={handleVolumeChange}
      />
    </>
  );
};
