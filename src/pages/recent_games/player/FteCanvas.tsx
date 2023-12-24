import { useRef } from "react";
import { useEventListener } from "usehooks-ts";
import { useFteController } from "../fte/hooks.ts";
import { toggleFullscreen } from "../fullscreen.ts";

export const FteCanvas = () => {
  const fte = useFteController();
  const documentRef = useRef<Document>(document);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // keyboard shortcuts
  useEventListener(
    "keydown",
    function (e: KeyboardEvent) {
      if (!fte || fte.isConsoleOpen()) {
        return;
      }

      switch (e.key) {
        case "Tab":
          e.preventDefault();
          return fte.command("+showscores");
        default:
          break;
      }
    },
    documentRef,
  );

  useEventListener("keyup", function (e: KeyboardEvent) {
    if (!fte) {
      return;
    }

    if (!fte.isConsoleOpen()) {
      switch (e.code) {
        case "Space":
          e.preventDefault();
          return fte.trackNext();
        case "ControlLeft":
          e.preventDefault();
          return fte.togglePlay();
        case "Tab":
          return fte.command("-showscores");
        default:
          break;
      }
    }

    if (["Backquote"].includes(e.code)) {
      e.preventDefault();
      return fte.toggleConsole();
    }
  });

  return (
    <canvas
      ref={canvasRef}
      id="fteCanvas"
      className={"absolute w-full h-full"}
      onPointerDown={() => fte?.togglePlay()}
      onDoubleClick={() => toggleFullscreen("ftePlayer")}
      onTouchStart={() => fte?.command("+scoreboard")}
      onTouchEnd={() => fte?.command("-scoreboard")}
    />
  );
};
