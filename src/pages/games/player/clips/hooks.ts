import { useEffect, useRef, useState } from "react";
import { useInterval } from "usehooks-ts";
import { useFteController } from "../../fte/hooks.ts";
import { useUrlClipParams } from "../../hooks.ts";
import { useClipEditor } from "./context.tsx";
import { useClipPlaylist } from "./playlist.tsx";

export function useClipPlayback() {
  useSeekToBegin();
  usePauseAtEnd();
  useClipListPlayback();
}

function useSeekToBegin() {
  const { from, track } = useUrlClipParams();
  const fte = useFteController();

  function applyTrack() {
    if (track !== "auto") {
      fte?.track(track);
    }
  }

  useEffect(() => {
    if (!fte || from < 1) {
      return;
    }

    applyTrack();
    fte.demoJump(from);
    fte.pause();
    window.setTimeout(applyTrack, 50);
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
  }
  if (hasParams) {
    return urlTo;
  }

  return null;
}

// multiple clips (?clip=...): start at the first clip, then play them in order
function useClipListPlayback() {
  const fte = useFteController();
  const { clips, activeIndex, active, goTo, playClip, isJumping, autoplay } =
    useClipPlaylist();
  const { isEnabled: clipEditorIsEnabled } = useClipEditor();
  const lastElapsedTime = useRef<number | null>(null);
  const interval = 100;

  useEffect(() => {
    if (!fte || clips.length === 0) {
      return;
    }

    playClip(0);
    fte.pause();
  }, [fte]);

  useInterval(
    () => {
      if (!fte || !active) {
        return;
      }

      const elapsedTime = fte.getDemoElapsedTime();

      if (isJumping(elapsedTime)) {
        lastElapsedTime.current = null;
        return;
      }

      const prevElapsedTime = lastElapsedTime.current;
      lastElapsedTime.current = elapsedTime;

      if (clipEditorIsEnabled) {
        return;
      }

      // follow manual seeks into another clip
      const isInActive = elapsedTime >= active.from && elapsedTime < active.to;

      if (!isInActive) {
        const index = clips.findIndex(
          (c) => elapsedTime >= c.from && elapsedTime < c.to,
        );

        if (index !== -1) {
          goTo(index);
          return;
        }
      }

      if (!fte.isPlaying() || prevElapsedTime === null) {
        return;
      }

      // only react to playback reaching the end, not to seeking past it
      const hasReachedEnd =
        prevElapsedTime < active.to &&
        elapsedTime >= active.to &&
        elapsedTime - prevElapsedTime < 1.5;

      if (!hasReachedEnd) {
        return;
      }

      if (autoplay && activeIndex + 1 < clips.length) {
        playClip(activeIndex + 1);
      } else {
        fte.pause();
      }
    },
    fte && active ? interval : null,
  );
}
