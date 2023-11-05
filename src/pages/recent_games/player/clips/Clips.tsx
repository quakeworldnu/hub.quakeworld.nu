import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faScissors } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { useClipEditor } from "./context.tsx";
import { useFteController } from "../../fte/hooks.ts";

export const DisableClipEditorButton = () => {
  const { toggle } = useClipEditor();

  return (
    <button
      className={classNames(
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
      Math.max(fte.getDemoElapsedTime() - 15, 0),
      fte.getDemoElapsedTime(),
    ]);
    setTrack(fte.isUsingAutotrack() ? "auto" : fte.getTrackUserid());
    enable();
    fte.pause();
  }

  if (!fte) {
    return null;
  }

  return (
    <button
      className={classNames(
        "flex text-sm items-center md:mt-0 py-2.5 px-3 rounded bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800",
      )}
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
