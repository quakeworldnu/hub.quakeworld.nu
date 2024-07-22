import { useFteController } from "../../fte/hooks.ts";
import { useUpdateInterval } from "../../hooks.ts";
import { formatDuration } from "../../time.ts";

export const GameClock = () => {
  const fte = useFteController();
  useUpdateInterval(fte ? 200 : null);

  if (!fte) {
    return null;
  }

  const elapsed = fte.getMatchElapsedTime();
  const total = fte.getMatchDuration();

  return (
    <div className="flex font-mono items-center px-2 whitespace-nowrap">
      {formatDuration(elapsed, total)}
    </div>
  );
};
