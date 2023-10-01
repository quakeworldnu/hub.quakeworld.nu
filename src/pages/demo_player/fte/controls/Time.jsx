import { useResultByInterval } from "@qwhub/pages/demo_player/fte/hooks";
import { secondsToString } from "@qwhub/pages/demo_player/util";

export const Time = ({ getGametime, durationStr }) => {
  const gametime = useResultByInterval(getGametime, 200);

  return (
    <div className="flex mr-auto font-mono items-center">
      {secondsToString(gametime)} / {durationStr}
    </div>
  );
};
