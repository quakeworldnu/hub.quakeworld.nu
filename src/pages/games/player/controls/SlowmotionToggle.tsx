import { faStopwatch, faStopwatch20 } from "@fortawesome/free-solid-svg-icons";

import { useFteController, useFteUpdateOnEvent } from "../../fte/hooks.ts";
import { IconToggleButton } from "./IconButton.tsx";

const slow = 20;
const normal = 100;

export const SlowmotionToggle = () => {
  useFteUpdateOnEvent("demo_setspeed");
  const fte = useFteController();

  function handleClick() {
    if (!fte) {
      return;
    }
    const newSpeed = currentSpeed === slow ? normal : slow;
    fte.setDemoSpeed(newSpeed);
  }

  if (!fte) {
    return null;
  }

  const currentSpeed = fte.getDemoSpeed();
  const isSlowmotion = currentSpeed === slow;

  return (
    <IconToggleButton
      onClick={handleClick}
      isEnabled={isSlowmotion}
      enabledTitle={"Disable slowmotion"}
      enabledIcon={faStopwatch20}
      disabledTitle={"Enable slowmotion"}
      disabledIcon={faStopwatch}
    />
  );
};
