import { fa1, faDiceOne } from "@fortawesome/free-solid-svg-icons";

import { IconToggleButton } from "@qwhub/pages/demo_player/DemoPlayer/fte/controls/IconToggleButton";

const slow = 20;
const normal = 100;

export const SlowmotionToggle = ({ currentSpeed, onChange }) => {
  function onClick() {
    const newSpeed = currentSpeed === slow ? normal : slow;
    onChange(newSpeed);
  }

  const isSlowmotion = currentSpeed === slow;

  return (
    <IconToggleButton
      onClick={onClick}
      isEnabled={isSlowmotion}
      enabledIcon={faDiceOne}
      disabledIcon={fa1}
    />
  );
};
