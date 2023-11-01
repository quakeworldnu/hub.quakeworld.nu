import { faColumns, faSquare } from "@fortawesome/free-solid-svg-icons";
import { IconToggleButton } from "./IconButton.tsx";
import { useFteController, useFteUpdateOnEvent } from "../../fte/hooks.ts";

export const SplitscreenToggle = () => {
  useFteUpdateOnEvent("cl_splitscreen");
  const fte = useFteController();

  function handleClick() {
    if (!fte) {
      return null;
    }

    fte.toggleSplitscreen();
  }

  if (!fte) {
    return null;
  }

  const isEnabled = fte.cl_splitscreen() > 0;

  return (
    <IconToggleButton
      onClick={handleClick}
      isEnabled={isEnabled}
      enabledTitle="Disable splitscreen"
      enabledIcon={faSquare}
      disabledTitle="Enable splitscreen"
      disabledIcon={faColumns}
    />
  );
};
