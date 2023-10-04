import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

import { IconToggleButton } from "@qwhub/pages/demo_player/fte/controls/IconToggleButton";
import { useFteController, useFteUpdateOnEvent } from "../hooks";

export const PlayToggle = () => {
  useFteUpdateOnEvent("play");
  useFteUpdateOnEvent("pause");
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
