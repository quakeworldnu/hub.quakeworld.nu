import { useFteController, useFteUpdateOnEvent } from "../../fte/hooks.ts";
import { VolumeToggle } from "./VolumeToggle.tsx";
import { VolumeSlider } from "./VolumeSlider.tsx";

export const Volume = () => {
  useFteUpdateOnEvent("volume");

  const fte = useFteController();

  if (!fte) {
    return null;
  }

  const volume = fte.getVolume();
  const isMuted = fte.isMuted();

  return (
    <>
      <VolumeToggle
        isEnabled={!isMuted}
        onClick={() => fte.toggleMute()}
        volume={volume}
      />
      <VolumeSlider
        volume={volume}
        isMuted={isMuted}
        maxVolume={fte.getMaxVolume()}
        onChange={(volume: number) => fte.setVolume(volume)}
      />
    </>
  );
};
