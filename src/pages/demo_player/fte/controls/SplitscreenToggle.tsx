import { faColumns, faSquare } from "@fortawesome/free-solid-svg-icons";

import { IconToggleButton } from "./IconToggleButton";
import { useFteController, useFteUpdateOnEvent } from "../hooks.ts";

export const SplitscreenToggle = () => {
  useFteUpdateOnEvent("cl_splitscreen");
  const fte = useFteController();

  function handleClick() {
    fte && fte.toggleSplitscreen();
  }

  if (!fte) {
    return null;
  }

  return (
    <IconToggleButton
      onClick={handleClick}
      isEnabled={fte.cl_splitscreen() > 0}
      enabledIcon={faSquare}
      disabledIcon={faColumns}
      title={
        fte.cl_splitscreen() ? "Disable splitscreen" : "Enable splitscreen"
      }
    />
  );
};
