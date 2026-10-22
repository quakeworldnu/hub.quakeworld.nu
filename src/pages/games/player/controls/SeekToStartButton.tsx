import { faBackwardStep } from "@fortawesome/free-solid-svg-icons";
import { useFteController } from "../../fte/hooks.ts";
import { useUrlClipParams } from "../../hooks.ts";
import { useClipEditor } from "../clips/context.tsx";
import { useClipPlaylist } from "../clips/playlist.tsx";
import { IconButton } from "./IconButton.tsx";

export const SeekToStartButton = () => {
  const fte = useFteController();
  const seekStartTime = useSeekStartTime();
  const { active: activeClip, activeIndex, playClip } = useClipPlaylist();

  function handleClick() {
    if (!fte) {
      return null;
    }

    // multiple clips: seek to start of clip, or to previous clip if already at start
    if (seekStartTime === 0 && activeClip) {
      const isAtStart = fte.getDemoElapsedTime() <= activeClip.from + 1;
      playClip(isAtStart ? Math.max(activeIndex - 1, 0) : activeIndex);
      fte.pause();
      return;
    }

    fte.demoJump(seekStartTime);
    fte.pause();
  }

  return (
    <IconButton
      onClick={handleClick}
      icon={faBackwardStep}
      title="Seek to start"
    />
  );
};

function useSeekStartTime(): number {
  const { from: editorFrom } = useClipEditor();
  const { from: urlFrom } = useUrlClipParams();

  if (editorFrom > 0) {
    return editorFrom;
  }
  if (urlFrom > 0) {
    return urlFrom;
  }
  return 0;
}
