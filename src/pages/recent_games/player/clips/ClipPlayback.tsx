import { useUrlClipParams } from "../../playlist/hooks.ts";
import { useBoolean, useInterval } from "usehooks-ts";
import { useFteController } from "../../fte/hooks.ts";
import { useEffect } from "react";

export function useClipPlayback() {
  const { from, to, track, hasParams } = useUrlClipParams();
  const { value: hasPaused, setTrue: setHasPaused } = useBoolean(false);
  const fte = useFteController();

  // initial
  useEffect(() => {
    if (!fte) {
      return;
    }

    if (hasParams) {
      if (track !== "auto") {
        fte.track(track);
      }
      fte.demoJump(from);
      fte.pause();
    }
  }, [fte]);

  useInterval(
    () => {
      if (!fte || hasPaused || !fte.isPlaying()) {
        return;
      }

      const demoTimeSecond = Math.floor(fte.getDemoElapsedTime());

      if (demoTimeSecond > to) {
        fte.pause();
        setHasPaused();
      }
    },
    hasPaused ? null : 200,
  );
}
