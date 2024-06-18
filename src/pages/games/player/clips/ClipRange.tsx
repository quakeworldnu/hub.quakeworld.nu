import { faGripLinesVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useState } from "react";
import { Range, getTrackBackground } from "react-range";
import { useFteController } from "../../fte/hooks.ts";
import { formatElapsed } from "../../time.ts";
import { useClipEditor } from "./context.tsx";

export const ClipRange = () => {
  const fte = useFteController();
  const { from, to, range, setRange } = useClipEditor();
  const [lastRange, setLastRange] = useState<number[]>(range);

  function handleFinalChange(values: number[]) {
    if (!fte) {
      return;
    }
    const [lastFrom, lastTo] = lastRange;

    if (lastFrom !== from) {
      fte.demoJump(from);
    } else if (lastTo !== to) {
      fte.demoJump(to);
    }

    setLastRange(values);
  }

  if (!fte) {
    return null;
  }

  const min = 0;
  const max = Math.ceil(fte?.getDemoDuration()) || 610;
  const countdownLength = fte?.getCountdownDuration();

  return (
    <Range
      draggableTrack
      onFinalChange={handleFinalChange}
      values={range}
      step={1}
      min={min}
      max={max}
      onChange={setRange}
      renderTrack={({ props, children }) => (
        <div
          onMouseDown={props.onMouseDown}
          onTouchStart={props.onTouchStart}
          className="flex w-full h-10 bg-bottom"
          style={{
            backgroundImage:
              "url(https://clips-media-assets2.twitch.tv/img/ss-tick-45x48.png)",
            ...props.style,
          }}
        >
          <div
            className="flex w-full h-full self-center bg-repeat-x cursor-grab"
            ref={props.ref}
            style={{
              background: getTrackBackground({
                values: range,
                colors: ["#0008", "#0000", "#0008"],
                min,
                max,
              }),
            }}
          >
            {children}
          </div>
        </div>
      )}
      renderThumb={({ props, isDragged }) => (
        <div
          className="flex w-4 h-12 justify-center items-center bg-blue-700 hover:bg-blue-800 border border-transparent hover:border-white"
          {...props}
          style={{ ...props.style, cursor: "col-resize" }}
        >
          <div
            className={classNames(
              "absolute rounded bg-blue-900 text-white font-mono p-1 px-1.5 text-xs",
              { "z-10": isDragged },
            )}
          >
            {formatElapsed(range[props.key] - countdownLength)}
          </div>

          <FontAwesomeIcon
            fixedWidth
            icon={faGripLinesVertical}
            className={classNames("", {
              "text-blue-200": !isDragged,
              "text-white": isDragged,
            })}
          />
        </div>
      )}
    />
  );
};
