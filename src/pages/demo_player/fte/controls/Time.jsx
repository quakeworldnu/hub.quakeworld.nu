import { secondsToString } from "@qwhub/pages/demo_player/fte/time";
import { useGametime } from "@qwhub/pages/demo_player/fte/hooks";

export const Time = ({ getGametime, durationStr }) => {
  const gametime = useGametime(getGametime, 200);

  return (
    <div className="flex mr-auto font-mono items-center">
      {secondsToString(gametime)} / {durationStr}
    </div>
  );
};
