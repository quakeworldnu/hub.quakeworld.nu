import { type MouseEvent, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { useDoubleTap } from "use-double-tap";
import { useLongPress } from "use-long-press";
import { useEventListener } from "usehooks-ts";
import { useFteController } from "../fte/hooks.ts";
import { toggleFullscreen } from "../fullscreen.ts";

export const FteCanvas = () => {
  const fte = useFteController();
  const documentRef = useRef<Document>(document);

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
          return fte.command("+__showscores");
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
          return fte.togglePlay();
        case "Tab":
          return fte.command("-__showscores");
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
    onSingleTap: () => fte?.togglePlay(),
  });

  const longPress = useLongPress(() => fte?.command("+__showscores"), {
    onFinish: () => fte?.command("-__showscores"),
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
