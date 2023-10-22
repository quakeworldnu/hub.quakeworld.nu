import { faExpand, faMinimize } from "@fortawesome/free-solid-svg-icons";

import { IconToggleButton } from "./IconToggleButton";
import { toggleFullscreen } from "../fullscreen.ts";
import screenfull from "screenfull";

export const FullscreenToggle = () => {
  function handleClick() {
    toggleFullscreen("fteCanvas");
  }

  return (
    <IconToggleButton
      onClick={handleClick}
      isEnabled={screenfull.isFullscreen}
      enabledIcon={faMinimize}
      disabledIcon={faExpand}
    />
  );
};
