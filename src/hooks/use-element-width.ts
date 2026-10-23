import { type RefObject, useEffect, useState } from "react";

// border-box width of the element, undefined until measured
export function useElementWidth(
  ref: RefObject<HTMLElement | null>,
): number | undefined {
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.borderBoxSize[0].inlineSize);
    });
    observer.observe(element, { box: "border-box" });
    return () => observer.disconnect();
  }, [ref]);

  return width;
}
