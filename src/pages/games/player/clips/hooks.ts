import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import { useFteController } from "../../fte/hooks.ts";
import { useUrlClipParams } from "../../playlist/hooks.ts";
import { useClipEditor } from "./context.tsx";

export function useClipPlayback() {
  useSeekToBegin();
  usePauseAtEnd();
}

function useSeekToBegin() {
  const { from, track } = useUrlClipParams();
  const fte = useFteController();

  useEffect(() => {
    if (!fte || from < 1) {
      return;
    }

    if (track !== "auto") {
      fte.track(track);
    }
    fte.demoJump(from);
    fte.pause();
  }, [fte]);
}

function usePauseAtEnd() {
  const endTime = useEndTime();
  const [shouldPause, setShouldPause] = useState<boolean>(true);
  const fte = useFteController();
  const interval = 100;

  useInterval(
    () => {
      if (!fte || !endTime || !fte.isPlaying()) {
        return;
      }

      const elapsedTime = fte.getDemoElapsedTime();
      const remainingTime = endTime - elapsedTime;
      const isBeforeEndTime = remainingTime > 0;

      if (isBeforeEndTime) {
        if (!shouldPause) {
          setShouldPause(true);
        }
      } else if (shouldPause) {
        fte.pause();
        setShouldPause(false);
      }
    },
    endTime ? interval : null,
  );
}

function useEndTime(): number | null {
  const { to: urlTo, hasParams } = useUrlClipParams();
  const { to: editorTo, isEnabled: clipEditorIsEnabled } = useClipEditor();

  if (clipEditorIsEnabled) {
    return editorTo;
  } else if (hasParams) {
    return urlTo;
  }

  return null;
}
