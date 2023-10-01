import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

import { IconToggleButton } from "@qwhub/pages/demo_player/DemoPlayer/fte/controls/IconToggleButton";

export const PlayToggle = ({ isPlaying, onClick }) => {
  return (
    <IconToggleButton
      onClick={onClick}
      isEnabled={isPlaying}
      enabledIcon={faPause}
      disabledIcon={faPlay}
    />
  );
};
