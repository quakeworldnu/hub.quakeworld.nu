import { useEffect } from "react";
import { useLocalStorage, useToggle } from "usehooks-ts";

export function useDemoScoreSpoiler() {
  const [globalShow] = useLocalStorage<boolean>("demoBrowserShowScores", false);
  const [isVisible, toggleVisible, setIsVisible] = useToggle(globalShow);

  useEffect(() => {
    setIsVisible(globalShow);
  }, [globalShow, setIsVisible]);

  return { isVisible, toggleVisible, show: () => setIsVisible(true) };
}
