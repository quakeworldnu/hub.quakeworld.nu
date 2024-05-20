import { faExpand, faMinimize } from "@fortawesome/free-solid-svg-icons";
import screenfull from "screenfull";
import { toggleFullscreen } from "../../fullscreen.ts";
import { IconToggleButton } from "./IconButton.tsx";

export const FullscreenToggle = () => {
  function handleClick() {
    toggleFullscreen("ftePlayer");
  }

  return (
    <IconToggleButton
      onClick={handleClick}
      isEnabled={screenfull.isFullscreen}
      enabledTitle={"Exit fullscreen"}
      enabledIcon={faMinimize}
      disabledTitle={"Enter fullscreen"}
      disabledIcon={faExpand}
    />
  );
};
