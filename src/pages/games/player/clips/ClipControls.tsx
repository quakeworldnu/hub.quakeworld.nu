import {
  faCopy,
  faMinus,
  faPlus,
  faScissors,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import copyTextToClipboard from "copy-text-to-clipboard";
import { toast } from "react-toastify";
import { useFteController, useFteEvent } from "../../fte/hooks.ts";
import { clamp } from "../../math.ts";
import { formatElapsed } from "../../time.ts";
import { btnPrimary, sizeSmall } from "../../ui/theme.ts";
import { ClipRange } from "./ClipRange.tsx";
import { DisableClipEditorButton } from "./Clips.tsx";
import { useClipEditor } from "./context.tsx";

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

      <div className="flex flex-wrap justify-between my-3 gap-3">
        <div className="hidden md:block w-32" />
        <AdjustControls />
        <div className="text-right">
          <CopyLinkButton />
        </div>
      </div>
    </div>
  );
};

export const CopyLinkButton = () => {
  const { getUrl } = useClipEditor();

  function handleClick() {
    copyTextToClipboard(getUrl());
    toast("Link copied to clipboard", { type: "success" });
  }

  return (
    <button className={`${btnPrimary} ${sizeSmall}`} onClick={handleClick}>
      <FontAwesomeIcon icon={faCopy} fixedWidth size="sm" className="mr-1" />
      Copy link
    </button>
  );
};

const AdjustControls = () => {
  const fte = useFteController();
  const { range, from, to, setFrom, setTo } = useClipEditor();

  if (!fte) {
    return null;
  }

  const rangeInGameTime = range.map((v) => v - fte.getCountdownDuration());

  return (
    <div className="flex flex-wrap grow items-center md:justify-center space-x-1 gap-y-1">
      <AdjustRangeButton current={from} delta={-5} onClick={setFrom} />
      <AdjustRangeButton current={from} delta={-1} onClick={setFrom} />
      <AdjustRangeButton current={from} delta={1} onClick={setFrom} />
      <AdjustRangeButton current={from} delta={5} onClick={setFrom} />
      <div className="font-mono text-sm px-2">
        {rangeInGameTime.map(formatElapsed).join(" - ")}
      </div>
      <AdjustRangeButton current={to} delta={-5} onClick={setTo} />
      <AdjustRangeButton current={to} delta={-1} onClick={setTo} />
      <AdjustRangeButton current={to} delta={1} onClick={setTo} />
      <AdjustRangeButton current={to} delta={5} onClick={setTo} />
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
    const newValue = clamp(current + delta, 0, fte.getDemoDuration());
    onClick(newValue);
    fte.demoJump(newValue);
  }

  return (
    <button
      className={classNames(
        "flex items-center bg-gradient-to-b from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 px-1.5 py-1 text-xs rounded",
        { "hidden sm:flex": Math.abs(delta) > 1 },
      )}
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
