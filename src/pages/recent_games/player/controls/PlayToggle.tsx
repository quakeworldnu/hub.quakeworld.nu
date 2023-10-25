import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

import { IconToggleButton } from "./IconToggleButton.tsx";
import { useFteController, useFteUpdateOnEvent } from "../../fte/hooks.ts";

export const PlayToggle = () => {
  useFteUpdateOnEvent("demo_setspeed");
  const fte = useFteController();

  if (!fte) {
    return null;
  }

  return (
    <IconToggleButton
      onClick={() => fte.togglePlay()}
      isEnabled={fte.isPlaying()}
      enabledIcon={faPause}
      disabledIcon={faPlay}
    />
  );
};
