import { secondsToString } from "@qwhub/pages/demo_player/DemoPlayer/fte/time";
import { useGametime } from "@qwhub/pages/demo_player/DemoPlayer/fte/hooks";

export const Time = ({ getGametime, durationStr }) => {
  const gametime = useGametime(getGametime, 200);

  return (
    <div className="flex mr-auto font-mono items-center">
      {secondsToString(gametime)} / {durationStr}
    </div>
  );
};
