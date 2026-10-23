import { faForwardStep } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@/components/fte-player/icon-button";
import { useClipEditor } from "@/features/demo-player/clips/clip-editor";
import { useClipPlaylist } from "@/features/demo-player/clips/clip-playlist";
import { useFteController } from "@/lib/fte/hooks";
import { useUrlClipParams } from "@/utils/game-url";

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
