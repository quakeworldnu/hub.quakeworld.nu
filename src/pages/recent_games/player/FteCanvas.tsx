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
      if (!fte) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          return fte.trackNext();
        case "Tab":
          e.preventDefault();
          return fte.command("+showscores");
        case "~":
          return fte.command("toggleconsole");
        case "`":
          return fte.command("toggleconsole");
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

    switch (e.key) {
      case "Tab":
        return fte.command("-showscores");
      default:
        break;
    }
  });

  return (
    <canvas
      ref={canvasRef}
      id="fteCanvas"
      className={"absolute w-full h-full"}
      onPointerDown={() => fte?.togglePlay()}
      onDoubleClick={() => toggleFullscreen("fteCanvas")}
      onTouchStart={() => fte?.command("+scoreboard")}
      onTouchEnd={() => fte?.command("-scoreboard")}
    />
  );
};
