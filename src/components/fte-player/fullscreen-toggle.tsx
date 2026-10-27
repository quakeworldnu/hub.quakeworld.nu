import {
  faExpand,
  faMinimize,
  faWindowMaximize,
  faWindowRestore,
} from "@fortawesome/free-solid-svg-icons";
import { useReducer, useRef } from "react";
import { useEventListener } from "usehooks-ts";
import {
  DISPLAY_MODE_CHANGE,
  isFullscreen,
  isFullWindow,
  toggleFullscreen,
  toggleFullWindow,
} from "@/utils/fullscreen";
import { IconToggleButton } from "./icon-button";

function useDisplayModeUpdate() {
  const [, update] = useReducer((x: number) => x + 1, 0);
  const documentRef = useRef<Document>(document);
  useEventListener(DISPLAY_MODE_CHANGE, update);
  useEventListener("fullscreenchange", update, documentRef);
}

export const FullscreenToggle = () => {
  useDisplayModeUpdate();
  const isEnabled = isFullscreen();

  return (
    <IconToggleButton
      onClick={() => toggleFullscreen("ftePlayer")}
      isEnabled={isEnabled}
      isSelected={isEnabled}
      enabledTitle={"Exit fullscreen"}
      enabledIcon={faMinimize}
      disabledTitle={"Enter fullscreen"}
      disabledIcon={faExpand}
    />
  );
};

export const FullWindowToggle = () => {
  useDisplayModeUpdate();
  const isEnabled = isFullWindow();

  return (
    <IconToggleButton
      onClick={() => toggleFullWindow("ftePlayer")}
      isEnabled={isEnabled}
      isSelected={isEnabled}
      enabledTitle={"Restore embedded size"}
      enabledIcon={faWindowRestore}
      disabledTitle={"Fill browser window"}
      disabledIcon={faWindowMaximize}
    />
  );
};
