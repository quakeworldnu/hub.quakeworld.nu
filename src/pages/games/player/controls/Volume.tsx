import { useFteController, useFteUpdateOnEvent } from "../../fte/hooks.ts";
import { VolumeSlider } from "./VolumeSlider.tsx";
import { VolumeToggle } from "./VolumeToggle.tsx";

export const Volume = () => {
  useFteUpdateOnEvent("volume");

  const fte = useFteController();

  if (!fte) {
    return null;
  }

  const volume = fte.getVolume();
  const isMuted = fte.isMuted();

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
