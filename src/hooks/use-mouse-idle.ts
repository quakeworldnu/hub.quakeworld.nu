import { useEffect, useRef } from "react";

// idle after `timeout` ms without mouse movement or pointer presses (touch taps) over the element (or document)
export function useMouseIdle({
  elementId,
  timeout,
  onIdle,
  onActive,
}: {
  elementId: string;
  timeout: number;
  onIdle: () => void;
  onActive: () => void;
}) {
  const callbacks = useRef({ onIdle, onActive });
  callbacks.current = { onIdle, onActive };

  useEffect(() => {
    const target: GlobalEventHandlers =
      document.getElementById(elementId) ?? document;
    const throttleMs = 200;
    let isIdle = false;
    let isTouchHeld = false;
    let lastMoveAt = 0;
    let timer = window.setTimeout(setIdle, timeout);

    function setIdle() {
      if (isTouchHeld) {
        return;
      }

      isIdle = true;
      callbacks.current.onIdle();
    }

    function restartTimer() {
      window.clearTimeout(timer);
      timer = window.setTimeout(setIdle, timeout);
    }

    function handleMove() {
      const now = Date.now();

      if (now - lastMoveAt < throttleMs) {
        return;
      }
      lastMoveAt = now;

      if (isIdle) {
        isIdle = false;
        callbacks.current.onActive();
      }

      restartTimer();
    }

    function handlePointerDown(e: PointerEvent) {
      isTouchHeld = e.pointerType === "touch";
      handleMove();
    }

    function handlePointerUp(e: PointerEvent) {
      if (e.pointerType === "touch" && isTouchHeld) {
        isTouchHeld = false;
        restartTimer();
      }
    }

    // capture: the engine canvas handles (and may stop) pointer events
    target.addEventListener("mousemove", handleMove);
    target.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("pointerup", handlePointerUp, true);
    window.addEventListener("pointercancel", handlePointerUp, true);
    return () => {
      window.clearTimeout(timer);
      target.removeEventListener("mousemove", handleMove);
      target.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("pointerup", handlePointerUp, true);
      window.removeEventListener("pointercancel", handlePointerUp, true);
    };
  }, [elementId, timeout]);
}
