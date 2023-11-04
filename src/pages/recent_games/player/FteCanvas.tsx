import { useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import { useFteController } from "../fte/hooks.ts";
import { toggleFullscreen } from "../fullscreen.ts";

export const FteCanvas = () => {
  const fte = useFteController();
  const [isShowingScores, setIsShowingScores] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleKeyDown(e: KeyboardEvent) {
    if (!fte) {
      return;
    }

    if (e.code === "Tab") {
      e.preventDefault();

      if (isShowingScores) {
        return;
      }
      fte.command("+showscores");
      setIsShowingScores(true);
    } else if (e.code === "Space") {
      fte.trackNext();
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (!fte) {
      return;
    }

    if (e.code === "Tab") {
      e.preventDefault();
      fte.command("-showscores");
      setIsShowingScores(false);
    }
  }

  useEventListener("keydown", handleKeyDown, canvasRef);
  useEventListener("keyup", handleKeyUp, canvasRef);

  return (
    <canvas
      ref={canvasRef}
      id="fteCanvas"
      className={"absolute w-full h-full"}
      onClick={() => fte?.togglePlay()}
      onDoubleClick={() => toggleFullscreen("fteCanvas")}
      onTouchStart={() => fte?.command("+scoreboard")}
      onTouchEnd={() => fte?.command("-scoreboard")}
    />
  );
};
