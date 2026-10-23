import { faClose, faScissors } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { btnPrimary, sizeLarge } from "@/components/ui/theme";
import { useFteController } from "@/lib/fte/hooks";
import { useClipEditor } from "./clip-editor";

const DEFAULT_CLIP_LENGTH = 60;

export const DisableClipEditorButton = () => {
  const { toggle } = useClipEditor();

  return (
    <button
      className={clsx(
        "flex text-xs items-center py-1.5 px-2 rounded bg-slate-700 hover:bg-slate-600",
      )}
      onClick={toggle}
    >
      <FontAwesomeIcon icon={faClose} fixedWidth className="mr-0.5" />
      Close
    </button>
  );
};

export const EnableClipEditorButton = () => {
  const { enable, setRange, setTrack } = useClipEditor();
  const fte = useFteController();

  function handleClick() {
    if (!fte) {
      return;
    }

    setRange([
      Math.max(fte.getDemoElapsedTime() - DEFAULT_CLIP_LENGTH, 0),
      fte.getDemoElapsedTime(),
    ]);
    setTrack(fte.isUsingAutotrack() ? "auto" : fte.getTrackUserid() || "");
    enable();
    fte.pause();
  }

  if (!fte) {
    return null;
  }

  return (
    <button
      className={`${btnPrimary} ${sizeLarge} app-effect-fade-in`}
      onClick={handleClick}
    >
      <FontAwesomeIcon
        icon={faScissors}
        fixedWidth
        size="sm"
        className="mr-1.5"
      />
      Clip
    </button>
  );
};
