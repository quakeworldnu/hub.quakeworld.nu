import { useFteController, useFteEvent } from "../../fte/hooks.ts";
import { useState } from "react";
import { PlayerInfo } from "../../fte/types.ts";

export const TrackedPlayer = ({ showTeam }: { showTeam: boolean }) => {
  const fte = useFteController();
  const [player, setPlayer] = useState<PlayerInfo | null>(null);

  function onTrackEvent() {
    setTimeout(() => {
      if (!fte) {
        return;
      }

      setPlayer(fte.getTrackedPlayer());
    }, 20);
  }

  useFteEvent("track", onTrackEvent);
  useFteEvent("__track_next", onTrackEvent);
  useFteEvent("cl_autotrack", onTrackEvent);

  if (!fte) {
    return null;
  }

  if (!player) {
    return null;
  }

  return (
    <span className="inline-block px-2 py-1 bg-black/50 rounded">
      {showTeam && <span className="mr-4">{player.team}</span>}
      <span className="font-bold">{player.name}</span>
    </span>
  );
};
