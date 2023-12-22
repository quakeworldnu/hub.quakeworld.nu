import { useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import { useFteController } from "../fte/hooks.ts";
import { toggleFullscreen } from "../fullscreen.ts";

export const FteCanvas = () => {
  const fte = useFteController();
  const documentRef = useRef<Document>(document);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [consoleOpen, setConsoleOpen] = useState<boolean>(false);

  function loadPreset(name: string) {
    if (!fte) {
      return;
    }

    fte.command(`fps_preset ${name}`);

    setTimeout(() => {
      const cmds = [
        'crosshairimage ""',
        "crosshaircolor 255 255 255",
        "v_kickpitch 0",
        "v_kickroll 0",
        "cl_bobup 0",
        "cl_rollangle 0",
        "cl_gibfilter 0",
      ];

      for (const cmd of cmds) {
        fte.command(cmd);
      }
    }, 50);
  }

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
        case "Control":
          e.preventDefault();
          return fte.togglePlay();
        case "Tab":
          return fte.command("-showscores");
        case "1":
          loadPreset("normal");
          return fte.command("exec default_preset.cfg");
        case "2":
          return loadPreset("vanilla");
        case "3":
          return loadPreset("286");
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
