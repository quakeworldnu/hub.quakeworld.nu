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
    const target = document.getElementById(elementId) ?? document;
    const throttleMs = 200;
    let isIdle = false;
    let lastMoveAt = 0;
    let timer = window.setTimeout(setIdle, timeout);

    function setIdle() {
      isIdle = true;
      callbacks.current.onIdle();
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

      window.clearTimeout(timer);
      timer = window.setTimeout(setIdle, timeout);
    }

    // capture: the engine canvas handles (and may stop) pointer events
    target.addEventListener("mousemove", handleMove);
    target.addEventListener("pointerdown", handleMove, true);
    return () => {
      window.clearTimeout(timer);
      target.removeEventListener("mousemove", handleMove);
      target.removeEventListener("pointerdown", handleMove, true);
    };
  }, [elementId, timeout]);
}
