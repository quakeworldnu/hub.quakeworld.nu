import { useUpdateInterval } from "@qwhub/hooks";
import { useFteController } from "../hooks";
import { formatTimeProgress } from "@qwhub/pages/demo_player/util";

export const GameClock = () => {
  const fte = useFteController();
  useUpdateInterval(fte ? 200 : null);

  if (!fte) {
    return null;
  }

  const elapsed = fte.getMatchElapsedTime();
  const total = fte.getMatchTotalTime();

  return (
    <div className="flex mr-auto font-mono items-center px-2">
      {formatTimeProgress(elapsed, total)}
    </div>
  );
};
