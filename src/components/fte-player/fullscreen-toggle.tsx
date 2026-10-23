import { faExpand, faMinimize } from "@fortawesome/free-solid-svg-icons";
import { isFullscreen, toggleFullscreen } from "@/utils/fullscreen";
import { IconToggleButton } from "./icon-button";

export const FullscreenToggle = () => {
  function handleClick() {
    toggleFullscreen("ftePlayer");
  }

  return (
    <IconToggleButton
      onClick={handleClick}
      isEnabled={isFullscreen()}
      enabledTitle={"Exit fullscreen"}
      enabledIcon={faMinimize}
      disabledTitle={"Enter fullscreen"}
      disabledIcon={faExpand}
    />
  );
};
