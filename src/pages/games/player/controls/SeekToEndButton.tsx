import { faForwardStep } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "./IconButton.tsx";
import { useFteController } from "../../fte/hooks.ts";
import { useClipEditor } from "../clips/context.tsx";
import { useUrlClipParams } from "../../playlist/hooks.ts";

export const SeekToEndButton = () => {
  const fte = useFteController();
  const seekEndTime = useSeekEndTime();

  function handleClick() {
    if (!fte) {
      return null;
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
  } else if (hasUrlParams) {
    return urlTo;
  }
  return 9999;
}
