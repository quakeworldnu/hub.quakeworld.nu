import { useEffect, useRef } from "react";
import { useEventListener, useResizeObserver } from "usehooks-ts";
import { useMouseIdle } from "@/hooks/use-mouse-idle";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { exitFullWindow } from "@/utils/fullscreen";

declare global {
  interface WindowEventMap {
    "fteplayer.mouse.idle": Event;
    "fteplayer.mouse.active": Event;
  }
}

export const FtePlayerCanvas = () => {
  // pointer events
  useMouseIdle({
    elementId: "ftePlayer",
    timeout: 2000,
    onIdle: () => dispatchEvent(new Event("fteplayer.mouse.idle")),
    onActive: () => dispatchEvent(new Event("fteplayer.mouse.active")),
  });

  // prevent screen idle
  useWakeLock();

  // never leave the page clipped by full-window mode
  useEffect(() => exitFullWindow, []);

  // fte resizes its framebuffer on window "resize" only: forward any canvas size
  // change (layout, sidebar, fullscreen, window)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useResizeObserver({
    ref: canvasRef as React.RefObject<HTMLCanvasElement>,
    onResize: () => window.dispatchEvent(new Event("resize")),
  });

  // keyboard events
  // typing in page inputs (e.g. settings): stop before fte's document capture
  // listeners, which would preventDefault and run engine binds. default action still applies
  function stopFromEditable(e: KeyboardEvent) {
    if (isEditable(e.target)) {
      e.stopPropagation();
    }
  }

  useEventListener("keydown", stopFromEditable, undefined, true);
  useEventListener("keypress", stopFromEditable, undefined, true);
  useEventListener("keyup", stopFromEditable, undefined, true);

  // shortcuts (tab, space, ctrl, console) are engine binds, see public/assets/fte/config_*.cfg

  return (
    // pointer input (player info, minimap, aim, gestures) is handled by the engine
    <div id="fteContainer">
      <canvas
        id="fteCanvas"
        ref={canvasRef}
        className={"absolute w-full h-full"}
      />
    </div>
  );
};

function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}
