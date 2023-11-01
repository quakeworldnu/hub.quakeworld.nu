import { faStopwatch, faStopwatch20 } from "@fortawesome/free-solid-svg-icons";

import { IconToggleButton } from "./IconButton.tsx";
import { useFteController, useFteUpdateOnEvent } from "../../fte/hooks.ts";

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
    fte.setSpeed(newSpeed);
  }

  if (!fte) {
    return null;
  }

  const currentSpeed = fte.demo_setspeed();
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
