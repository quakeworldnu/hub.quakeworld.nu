import { useState } from "react";
import { getTrackBackground, Range } from "react-range";
import { secondsToMinutesAndSeconds } from "../time.ts";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faGripLinesVertical } from "@fortawesome/free-solid-svg-icons";
import { useFteController } from "../fte/hooks.ts";

export const ClipTimeSlider = () => {
  const fte = useFteController();
  const from = fte?.getDemoElapsedTime() || 0;
  const to = from + 15;

  const [values, setValues] = useState<number[]>([from, to]);

  function handleChange(newValues: number[]) {
    if (!fte) {
      return;
    }

    const hasChangedStartValue = newValues[0] !== values[0];
    const hasChangedEndValue = newValues[1] !== values[1];
    const hasChangedBothValues = hasChangedStartValue && hasChangedEndValue;

    if (hasChangedBothValues || hasChangedStartValue) {
      fte.demoJump(newValues[0]);
    } else {
      fte.demoJump(newValues[1]);
    }

    setValues(newValues);
  }

  if (!fte) {
    return null;
  }

  const min = 0;
  const max = fte.getDemoTotalTime();

  return (
    <div className="flex flex-wrap justify-center">
      <div className="flex my-4 items-center space-x-4 justify-around">
        <button className="bg-slate-700 p-2 py-1.5 rounded">Start</button>
        <button className="bg-slate-700 p-2 py-1.5 rounded">Play</button>
        <button className="bg-slate-700 p-2 py-1.5 rounded">End</button>
      </div>

      <Range
        draggableTrack
        values={values}
        step={1}
        min={min}
        max={max}
        onChange={handleChange}
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
                  values,
                  colors: ["#0009", "#0000", "#0009"],
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
            className="flex w-4 h-full justify-center items-center bg-blue-700 hover:bg-blue-800 border border-transparent hover:border-white"
            {...props}
            style={{ ...props.style, cursor: "col-resize" }}
          >
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
      <div className="flex items-center space-x-4 bg-black  w-full p-4 text-xs justify-center">
        <div className="flex items-center space-x-4">
          <button
            className="bg-slate-700 p-2 py-1.5 rounded"
            onClick={() => setValues([fte?.getDemoElapsedTime(), values[1]])}
          >
            Set start
          </button>

          <button
            className="bg-slate-700 p-2 py-1.5 rounded"
            onClick={() => fte?.demoJump(values[0])}
          >
            Jump to start
          </button>

          <div className="font-mono">
            {values.map(secondsToMinutesAndSeconds).join(" - ")} (
            {values[1] - values[0]}s)
          </div>

          <button
            className="bg-slate-700 p-2 py-1.5 rounded"
            onClick={() => fte?.demoJump(values[1])}
          >
            Jump to end
          </button>

          <button
            className="bg-slate-700 p-2 py-1.5 rounded"
            onClick={() => setValues([values[0], fte?.getDemoElapsedTime()])}
          >
            Set end
          </button>

          <button
            data-url={`https://asdasdasdasd?demoId=x&from=${values[0]}&to=${values[1]}`}
            className="bg-slate-700 p-2 py-1.5 rounded"
          >
            <FontAwesomeIcon icon={faCopy} fixedWidth className="mr-1" />
            Copy link
          </button>
        </div>
      </div>
    </div>
  );
};
