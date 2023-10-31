import { getTrackBackground, Range } from "react-range";
import classNames from "classnames";
import { secondsToMinutesAndSeconds } from "../../time.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLinesVertical } from "@fortawesome/free-solid-svg-icons";
import { useClipEditor } from "./context.tsx";
import { useFteController } from "../../fte/hooks.ts";
import { useState } from "react";

export const ClipRange = () => {
  const fte = useFteController();
  const { from, to, range, setRange } = useClipEditor();
  const [lastRange, setLastRange] = useState<number[]>(range);

  function handleFinalChange(values: number[]) {
    console.log("handleFinalChange", values);

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

  const min = 0;
  const max = 610;

  return (
    <div>
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
                "absolute rounded bg-blue-800 text-white font-mono p-1 px-1.5 text-xs",
                { "z-10": isDragged },
              )}
            >
              {secondsToMinutesAndSeconds(range[props.key])}
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
    </div>
  );
};
