import { useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import { useFteController } from "../fte/hooks.ts";
import { toggleFullscreen } from "../fullscreen.ts";

export const FteCanvas = () => {
  const fte = useFteController();
  const documentRef = useRef<Document>(document);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [consoleOpen, setConsoleOpen] = useState<boolean>(false);

  // keyboard shortcuts
  useEventListener(
    "keydown",
    function (e: KeyboardEvent) {
      if (!fte || consoleOpen) {
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

    if (!consoleOpen) {
      switch (e.key) {
        case " ":
          e.preventDefault();
          return fte.trackNext();
        case "Tab":
          return fte.command("-showscores");
        default:
          break;
      }
    }

    if (["`", "~", "§"].includes(e.key)) {
      e.preventDefault();
      setConsoleOpen(!consoleOpen);
      return fte.command("toggleconsole");
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
