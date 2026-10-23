import clsx from "clsx";
import { useDemoScoreSpoiler } from "./hooks.ts";

export const ScoreSpoiler = ({ score }: { score: string }) => {
  const { isVisible, show } = useDemoScoreSpoiler();

  return (
    <span
      title="Show scores"
      onClick={show}
      className={clsx("inline-block p-2 cursor-pointer", {
        "blur-xs": !isVisible,
      })}
    >
      {isVisible ? score : "xxx xxx"}
    </span>
  );
};
