import { ClipRange } from "./ClipRange.tsx";
import { DisableClipEditorButton } from "./Clips.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faScissors } from "@fortawesome/free-solid-svg-icons";
import { useClipEditor } from "./context.tsx";
import copyTextToClipboard from "copy-text-to-clipboard";
import { useFteEvent } from "../../fte/hooks.ts";

export const ClipControls = () => {
  const { setTrack } = useClipEditor();

  useFteEvent("cl_autotrack", (e: CustomEvent) => {
    if (e.detail.value === "stats") {
      setTrack("auto");
    }
  });

  useFteEvent("track", (e: CustomEvent) => {
    setTrack(e.detail.value);
  });

  return (
    <div className="px-4 py-px bg-slate-800 rounded-xl">
      <div className="flex justify-between items-center my-3">
        <div className="flex items-center text-slate-400">
          <FontAwesomeIcon
            icon={faScissors}
            size="sm"
            fixedWidth
            className="mr-1"
          />
          <div className="font-bold">Create clip</div>
        </div>

        <DisableClipEditorButton />
      </div>

      <div className="my-3">
        <ClipRange />
      </div>

      <div className="flex items-center my-3">
        <CopyClipUrlButton />
      </div>
    </div>
  );
};

export const CopyClipUrlButton = () => {
  const { getUrl } = useClipEditor();

  return (
    <button
      className="bg-violet-700 hover:bg-violet-600 px-2 py-1.5 text-xs rounded font-bold"
      onClick={() => copyTextToClipboard(getUrl())}
    >
      <FontAwesomeIcon icon={faCopy} fixedWidth className="mr-1.5" />
      Copy URL to clipboard
    </button>
  );
};
