import { useDemoScoreSpoiler } from "./hooks.ts";
import classNames from "classnames";

export const ScoreSpoiler = ({ score }: { score: string }) => {
  const { isVisible, show } = useDemoScoreSpoiler();

  return (
    <span
      title="Show scores"
      onClick={show}
      className={classNames("inline-block p-2 cursor-pointer", {
        "blur-sm": !isVisible,
      })}
    >
      {isVisible ? score : "xxx xxx"}
    </span>
  );
};
