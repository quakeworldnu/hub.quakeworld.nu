import { faBackwardStep } from "@fortawesome/free-solid-svg-icons";
import { useFteController } from "../../fte/hooks.ts";
import { useUrlClipParams } from "../../hooks.ts";
import { useClipEditor } from "../clips/context.tsx";
import { IconButton } from "./IconButton.tsx";

export const SeekToStartButton = () => {
  const fte = useFteController();
  const seekStartTime = useSeekStartTime();

  function handleClick() {
    if (!fte) {
      return null;
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
