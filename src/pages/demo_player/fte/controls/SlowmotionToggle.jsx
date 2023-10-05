import { faStopwatch, faStopwatch20 } from "@fortawesome/free-solid-svg-icons";

import { IconToggleButton } from "@qwhub/pages/demo_player/fte/controls/IconToggleButton";
import { useFteController, useFteUpdateOnEvent } from "../hooks";

const slow = 20;
const normal = 100;

export const SlowmotionToggle = () => {
  useFteUpdateOnEvent("demo_setspeed");
  const fte = useFteController();

  if (!fte) {
    return null;
  }

  const currentSpeed = fte.demo_setspeed();

  function onClick() {
    const newSpeed = currentSpeed === slow ? normal : slow;
    fte.setSpeed(newSpeed);
  }

  const isSlowmotion = currentSpeed === slow;

  return (
    <IconToggleButton
      onClick={onClick}
      isEnabled={isSlowmotion}
      enabledIcon={faStopwatch20}
      disabledIcon={faStopwatch}
    />
  );
};
