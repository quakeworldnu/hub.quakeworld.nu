import { faExpand, faMinimize } from "@fortawesome/free-solid-svg-icons";

import { IconToggleButton } from "./IconToggleButton";
import { toggleFullscreen } from "../player.ts";
import screenfull from "screenfull";

export const FullscreenToggle = () => {
  return (
    <IconToggleButton
      onClick={toggleFullscreen}
      isEnabled={screenfull.isFullscreen}
      enabledIcon={faMinimize}
      disabledIcon={faExpand}
    />
  );
};
