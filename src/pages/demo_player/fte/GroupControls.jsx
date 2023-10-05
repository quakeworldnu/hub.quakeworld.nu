import {
  useFteController,
  useFteEventBySource,
} from "@qwhub/pages/demo_player/fte/hooks";
import { useUser } from "@qwhub/pages/demo_player/services/convex/hooks";
import { useEffect, useState } from "react";
import { Debug } from "@qwhub/pages/demo_player/fte/Debug";

export const GroupControls = () => {
  const fte = useFteController();
  const { user, group, playback, createPlayback, updatePlayback } = useUser();
  const [isSynced, setIsSynced] = useState(false);

  // initial group playback
  useEffect(() => {
    if (fte && playback === null) {
      createPlayback({
        demo_jump: fte.getDemoElapsedTime(),
        demo_setspeed: fte.demo_setspeed(),
        cl_autotrack: fte.cl_autotrack(),
        track: fte.getTrackUserid(),
      });
    }
  }, [fte, playback]);

  // follow group playback
  useEffect(() => {
    if (!fte || !playback || (isSynced && playback.updateUserId === user._id)) {
      return;
    }

    fte.applyGroupPlayback(playback);

    if (!isSynced) {
      setIsSynced(true);
    }
  }, [fte, playback, isSynced]);

  // update group playback
  useFteEventBySource("demo_jump", "user", (e) => {
    updatePlayback({ demo_jump: e.detail.value });
  });
  useFteEventBySource("demo_setspeed", "user", (e) => {
    updatePlayback({ demo_setspeed: e.detail.value });
  });
  useFteEventBySource("cl_autotrack", "user", (e) => {
    updatePlayback({ cl_autotrack: e.detail.value });
  });
  useFteEventBySource("track", "user", (e) => {
    updatePlayback({ track: e.detail.value });
  });

  return (
    <div>
      <div className="flex space-between hidden">
        <Debug
          value={{
            fte: typeof fte,
            playback: typeof playback,
          }}
        />
        <Debug value={group} />
        <Debug value={playback} />
      </div>
    </div>
  );
};
