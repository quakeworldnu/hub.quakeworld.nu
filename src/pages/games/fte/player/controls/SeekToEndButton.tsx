import { faForwardStep } from "@fortawesome/free-solid-svg-icons";
import { useUrlClipParams } from "../../../hooks.ts";
import { useFteController } from "../../hooks.ts";
import { useClipEditor } from "../clips/context.tsx";
import { useClipPlaylist } from "../clips/playlist.tsx";
import { IconButton } from "./IconButton.tsx";

export const SeekToEndButton = () => {
  const fte = useFteController();
  const seekEndTime = useSeekEndTime();
  const {
    clips,
    active: activeClip,
    activeIndex,
    playClip,
  } = useClipPlaylist();

  function handleClick() {
    if (!fte) {
      return null;
    }

    // multiple clips: seek to end of clip, or to next clip if already at end
    if (seekEndTime === 9999 && activeClip) {
      const isAtEnd = fte.getDemoElapsedTime() >= activeClip.to - 1;

      if (!isAtEnd) {
        fte.demoJump(activeClip.to);
      } else if (activeIndex + 1 < clips.length) {
        playClip(activeIndex + 1);
      }

      fte.pause();
      return;
    }

    fte.demoJump(seekEndTime);
    fte.pause();
  }

  return (
    <IconButton
      onClick={handleClick}
      icon={faForwardStep}
      title="Seek to end"
    />
  );
};

function useSeekEndTime(): number {
  const { isEnabled: editorIsEnabled, to: editorTo } = useClipEditor();
  const { hasParams: hasUrlParams, to: urlTo } = useUrlClipParams();

  if (editorIsEnabled) {
    return editorTo;
  }
  if (hasUrlParams) {
    return urlTo;
  }
  return 9999;
}
