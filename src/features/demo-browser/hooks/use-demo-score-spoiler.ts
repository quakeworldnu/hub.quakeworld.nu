import { useEffect } from "react";
import { useToggle } from "usehooks-ts";
import { useShowScores } from "@/hooks/use-show-scores";

export function useDemoScoreSpoiler() {
  const [globalShow] = useShowScores();
  const [isVisible, toggleVisible, setIsVisible] = useToggle(globalShow);

  useEffect(() => {
    setIsVisible(globalShow);
  }, [globalShow, setIsVisible]);

  return { isVisible, toggleVisible, show: () => setIsVisible(true) };
}
