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
        "flex text-xs items-center py-1 px-1.5 rounded bg-slate-700 hover:bg-slate-600",
      )}
      onClick={toggle}
    >
      <FontAwesomeIcon icon={faClose} fixedWidth className="mr-0.5" />
      Close
    </button>
  );
};

export const EnableClipEditorButton = () => {
  const { enable, setRange } = useClipEditor();
  const fte = useFteController();

  function handleClick() {
    if (!fte) {
      return;
    }

    setRange([
      Math.max(fte.getDemoElapsedTime() - 15, 0),
      fte.getDemoElapsedTime(),
    ]);
    enable();
    fte.pause();
  }

  return (
    <button
      className={classNames(
        "flex text-sm items-center md:mt-0 py-2.5 px-4 rounded bg-gradient-to-b from-violet-700 to-violet-900 hover:from-violet-600 hover:to-violet-800",
      )}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faScissors} fixedWidth className="mr-1.5" />
      Share Clip
    </button>
  );
};
