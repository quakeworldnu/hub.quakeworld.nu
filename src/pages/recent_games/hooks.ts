import {
  useCounter,
  useDebounce,
  useEffectOnce,
  useEventListener,
  useInterval,
} from "usehooks-ts";
import { useEffect, useState } from "react";

export function useUpdateInterval(delay: number | null) {
  const { count, increment } = useCounter(0);
  useInterval(increment, delay);
  return count;
}

const delay = 100;
const initialDelay = 300;

export function useElementHeight(elementId: string) {
  const [height, setHeight] = useState(0);
  const debouncedHeight = useDebounce(height, delay);

  function handleResize() {
    const targetEl = document.getElementById(elementId);
    if (!targetEl) {
      return;
    }
    console.log("handleResize");
    setHeight(getElementTotalHeight(targetEl));
  }

  useEventListener("resize", handleResize);

  useEffectOnce(() => {
    setTimeout(handleResize, initialDelay);
  });

  useEffect(() => {
    handleResize();
  }, [debouncedHeight]);

  return debouncedHeight;
}

function getElementTotalHeight(el: HTMLElement): number {
  const style = window.getComputedStyle(el);
  const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
  return Math.ceil(el.clientHeight + margin);
}
