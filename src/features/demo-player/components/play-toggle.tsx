import { faCirclePause, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { IconToggleButton } from "@/components/fte-player/icon-button";
import { useFteController, useFtePolledValue } from "@/lib/fte/hooks";

export const PlayToggle = () => {
  const fte = useFteController();
  const isPlaying = useFtePolledValue(
    "demo_setspeed",
    () => fte?.isPlaying() ?? false,
  );

  function handleClick() {
    if (!fte) {
      return null;
    }
    fte.togglePlay();
  }

  if (!fte) {
    return null;
  }

  return (
    <IconToggleButton
      size={"2xl"}
      onClick={handleClick}
      isEnabled={isPlaying}
      enabledTitle="Pause"
      enabledIcon={faCirclePause}
      disabledTitle="Play"
      disabledIcon={faCirclePlay}
    />
  );
};
