import { faExpand, faMinimize } from "@fortawesome/free-solid-svg-icons";

import { IconToggleButton } from "@qwhub/pages/demo_player/fte/controls/IconToggleButton";

export const FullscreenToggle = ({ onClick, isFullscreen }) => {
  return (
    <IconToggleButton
      onClick={onClick}
      isEnabled={isFullscreen}
      enabledIcon={faMinimize}
      disabledIcon={faExpand}
    />
  );
};
