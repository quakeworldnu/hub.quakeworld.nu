import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { IconToggleButton } from "./IconButton.tsx";
import { useFteController, useFteUpdateOnEvent } from "../../fte/hooks.ts";

export const PlayToggle = () => {
  useFteUpdateOnEvent("demo_setspeed");
  const fte = useFteController();

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
      size={"xl"}
      onClick={handleClick}
      isEnabled={fte.isPlaying()}
      enabledTitle="Pause"
      enabledIcon={faPause}
      disabledTitle="Play"
      disabledIcon={faPlay}
    />
  );
};
