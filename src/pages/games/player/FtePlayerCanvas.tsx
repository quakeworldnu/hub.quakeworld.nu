import { type MouseEvent, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { useDoubleTap } from "use-double-tap";
import { useLongPress } from "use-long-press";
import { useEventListener } from "usehooks-ts";
import { useFteController } from "../fte/hooks.ts";
import { toggleFullscreen } from "../fullscreen.ts";
import { useWakeLock } from "../hooks.ts";

export type Config = {
  preset: "demoPlayer" | "qtvPlayer";
};

export const FtePlayerCanvas = ({ config }: { config: Config }) => {
  const fte = useFteController();
  const documentRef = useRef<Document>(document);

  // prevent screen idle
  useWakeLock();

  // keyboard events
  useEventListener(
    "keydown",
    (e: KeyboardEvent) => {
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

  useEventListener("keyup", (e: KeyboardEvent) => {
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

          if (config.preset === "demoPlayer") {
            fte.togglePlay();
          }
          break;
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

  // pointer events
  function onDoubleTap(e: MouseEvent<HTMLCanvasElement>) {
    if (config.preset === "qtvPlayer") {
      toggleFullscreen("ftePlayer");
      return;
    }

    const { x } = relativeEventPositionInPercent(e);
    const threshold = 25;

    if (x < threshold) {
      fte?.seekBackward(10);
    } else if (x > 100 - threshold) {
      fte?.seekForward(10);
    } else {
      toggleFullscreen("ftePlayer");
    }
  }

  const dblTap = useDoubleTap(onDoubleTap, 300, {
    onSingleTap: () => {
      if (config.preset === "demoPlayer") {
        fte?.togglePlay();
      }
    },
  });

  const longPress = useLongPress(() => fte?.command("+showscores"), {
    onFinish: () => fte?.command("-showscores"),
  });

  const swipe = useSwipeable({
    onSwipedLeft: () => fte?.trackPrev(),
    onSwipedRight: () => fte?.trackNext(),
    trackMouse: true,
    swipeDuration: 500,
    preventScrollOnSwipe: true,
  });

  return (
    <canvas
      id="fteCanvas"
      className={"absolute w-full h-full"}
      onContextMenu={(e) => e.preventDefault()}
      {...dblTap}
      {...longPress()}
      {...swipe}
    />
  );
};

function relativeEventPositionInPercent(e: MouseEvent<HTMLCanvasElement>): {
  x: number;
  y: number;
} {
  const targetElementWidth = (e.target as HTMLCanvasElement).clientWidth;
  const targetElementHeight = (e.target as HTMLCanvasElement).clientHeight;

  return {
    x: Math.round((100 * e.clientX) / targetElementWidth),
    y: Math.round((100 * e.clientY) / targetElementHeight),
  };
}
