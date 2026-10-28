import { faStopwatch, faStopwatch20 } from "@fortawesome/free-solid-svg-icons";
import { IconToggleButton } from "@/components/fte-player/icon-button";
import { useFteController, useFtePolledValue } from "@/lib/fte/hooks";

const slow = 20;
const normal = 100;

export const SlowmotionToggle = () => {
  const fte = useFteController();
  const currentSpeed = useFtePolledValue(
    "demo_setspeed",
    () => fte?.getDemoSpeed() ?? normal,
  );

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
