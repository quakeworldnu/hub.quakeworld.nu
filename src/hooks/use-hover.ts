import { type RefObject, useEffect, useState } from "react";

export function useHover(ref: RefObject<HTMLElement | null>): boolean {
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const handleEnter = () => setIsHover(true);
    const handleLeave = () => setIsHover(false);
    element.addEventListener("mouseenter", handleEnter);
    element.addEventListener("mouseleave", handleLeave);
    return () => {
      element.removeEventListener("mouseenter", handleEnter);
      element.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref]);

  return isHover;
}
