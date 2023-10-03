import { useUpdateInterval } from "@qwhub/hooks";
import { secondsToString } from "@qwhub/pages/demo_player/util";
import { useFteController } from "@qwhub/pages/demo_player/fte/hooks";

export const Time = () => {
  const fte = useFteController();
  useUpdateInterval(fte ? 200 : null);

  if (!fte) {
    return null;
  }

  const elasped = fte.getDemoTime();
  const total = fte.getTimelimit() * 60;

  return (
    <div className="flex mr-auto font-mono items-center">
      {secondsToString(elasped)} / {secondsToString(total)}
    </div>
  );
};
