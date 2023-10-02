import { fa1, faDiceOne } from "@fortawesome/free-solid-svg-icons";

import { IconToggleButton } from "@qwhub/pages/demo_player/fte/controls/IconToggleButton";
import {
  useFteController,
  useFteUpdateOnEvent,
} from "@qwhub/pages/demo_player/fte/hooks";

const slow = 20;
const normal = 100;

export const SlowmotionToggle = () => {
  useFteUpdateOnEvent("demo_setspeed");
  const fte = useFteController();

  if (!fte) {
    return null;
  }

  const currentSpeed = fte.speed();

  function onClick() {
    const newSpeed = currentSpeed === slow ? normal : slow;
    fte.setSpeed(newSpeed);
  }

  const isSlowmotion = currentSpeed === slow;

  return (
    <div>
      {fte.speed()}
      <IconToggleButton
        onClick={onClick}
        isEnabled={isSlowmotion}
        enabledIcon={faDiceOne}
        disabledIcon={fa1}
      />
    </div>
  );
};
