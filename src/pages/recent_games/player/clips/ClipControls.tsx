import { ClipRange } from "./ClipRange.tsx";
import { DisableClipEditorButton } from "./Clips.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faMinus,
  faPlus,
  faScissors,
} from "@fortawesome/free-solid-svg-icons";
import { useClipEditor } from "./context.tsx";
import copyTextToClipboard from "copy-text-to-clipboard";
import { useFteController, useFteEvent } from "../../fte/hooks.ts";
import { secondsToMinutesAndSeconds } from "../../time.ts";
import { clamp } from "../../math.ts";

export const ClipControls = () => {
  const { setTrack, range, from, to, setFrom, setTo } = useClipEditor();

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

      <div className="my-2">
        <ClipRange />
      </div>

      <div className="flex flex-wrap items-center ">
        <div className="w-48"></div>

        <div className="flex flex-wrap grow items-center justify-center space-x-1 my-3">
          <AdjustRangeButton current={from} delta={-5} onClick={setFrom} />
          <AdjustRangeButton current={from} delta={-1} onClick={setFrom} />
          <AdjustRangeButton current={from} delta={1} onClick={setFrom} />
          <AdjustRangeButton current={from} delta={5} onClick={setFrom} />
          <div className="font-mono text-sm px-2">
            {range.map(secondsToMinutesAndSeconds).join(" - ")}
          </div>
          <AdjustRangeButton current={to} delta={-5} onClick={setTo} />
          <AdjustRangeButton current={to} delta={-1} onClick={setTo} />
          <AdjustRangeButton current={to} delta={1} onClick={setTo} />
          <AdjustRangeButton current={to} delta={5} onClick={setTo} />
        </div>

        <div className="w-48 text-right">
          <CopyClipUrlButton />
        </div>
      </div>
    </div>
  );
};

const AdjustRangeButton = ({
  current,
  delta,
  onClick,
}: {
  current: number;
  delta: number;
  onClick: (delta: number) => void;
}) => {
  const fte = useFteController();

  function handleClick() {
    if (!fte) {
      return;
    }
    const newValue = clamp(current + delta, 0, fte.getDemoTotalTime());
    onClick(newValue);
    fte.demoJump(newValue);
  }

  return (
    <button
      className="bg-violet-700 hover:bg-violet-600 px-1.5 py-1 text-xs rounded font-bold"
      onClick={handleClick}
    >
      <FontAwesomeIcon
        icon={delta > 0 ? faPlus : faMinus}
        size="sm"
        className="mr-1"
      />
      {Math.abs(delta)}
    </button>
  );
};

export const CopyClipUrlButton = () => {
  const { getUrl } = useClipEditor();

  return (
    <button
      className="bg-blue-700 hover:bg-blue-600 px-2 py-1.5 text-xs rounded font-bold"
      onClick={() => copyTextToClipboard(getUrl())}
    >
      <FontAwesomeIcon icon={faCopy} fixedWidth className="mr-1.5" />
      Copy URL to clipboard
    </button>
  );
};
