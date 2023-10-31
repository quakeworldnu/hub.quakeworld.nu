import { getTrackBackground, Range } from "react-range";
import { secondsToMinutesAndSeconds } from "../time.ts";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faCopy,
  faForwardStep,
  faGripLinesVertical,
} from "@fortawesome/free-solid-svg-icons";
import { useFteController } from "../fte/hooks.ts";
import { PlayToggle } from "./controls/PlayToggle.tsx";
import { useClipEditor } from "./Clips.tsx";
import { throttle } from "@martinstark/throttle-ts";
import * as Slider from "@radix-ui/react-slider";

export const ClipControls = () => {
  const fte = useFteController();
  const { from, to, setTimeFrom, setTimeTo } = useClipEditor();

  const handleChange = (values: number[] | undefined) => {
    console.log(new Date().toISOString(), "handleChange");
    if (!fte || !values) {
      return;
    }

    const [newFrom, newTo] = values;
    const hasChangedFrom = newFrom !== from;
    const hasChangedTo = newTo !== to;
    const hasChangedBoth = hasChangedFrom && hasChangedTo;

    if (hasChangedBoth || hasChangedFrom) {
      fte.demoJump(newFrom);
    } else {
      fte.demoJump(newTo);
    }

    if (hasChangedFrom) {
      setTimeFrom(newFrom);
    }

    if (hasChangedTo) {
      setTimeTo(newTo);
    }
  };

  if (!fte) {
    return null;
  }

  const [handleChangeThrottled] = throttle(handleChange, 1500);

  const min = 0;
  const max = fte.getDemoTotalTime();
  const values = [from, to];

  console.log("values", values);

  function handleTimeSliderChange(args) {
    fte?.demoJump(args[0]);
    console.log("handleTimeSliderChange", args);
  }

  return (
    <div className="flex flex-wrap justify-center mt-4">
      <div className="flex w-full my-2">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-8 group cursor-pointer transition-colors"
          value={values}
          onValueChange={handleTimeSliderChange}
          min={0}
          max={max}
          step={1}
        >
          <Slider.Track className="bg-gray-400 relative grow h-1.5">
            <Slider.Range className="absolute bg-purple-700 h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-4 h-4 bg-purple-600 rounded-full focus:outline-none transition-size duration-100"
            aria-label="Seek"
          />
        </Slider.Root>
      </div>
      <Range
        draggableTrack
        values={values}
        step={1}
        min={min}
        max={max}
        onChange={handleChangeThrottled}
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
            className="flex w-4 h-12 justify-center items-center bg-blue-700 hover:bg-blue-800 border border-transparent hover:border-white"
            {...props}
            style={{ ...props.style, cursor: "col-resize" }}
          >
            <div
              className={classNames(
                "absolute rounded bg-blue-800 text-white font-mono p-1 px-1.5 text-xs -top-14",
                {
                  "z-10": isDragged,
                },
              )}
            >
              {secondsToMinutesAndSeconds(values[props.key])}
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

      <div className="flex my-4 items-center space-x-4 justify-around">
        <button
          className="bg-slate-700 p-2 py-1.5 rounded"
          onClick={() => setTimeFrom(fte?.getDemoElapsedTime())}
        >
          Set start
        </button>

        <button
          className="bg-slate-700 p-2 py-1.5 rounded"
          onClick={() => fte?.demoJump(from)}
        >
          <FontAwesomeIcon icon={faBackwardStep} fixedWidth />
        </button>
        <button
          className="bg-slate-700 p-2 py-1.5 rounded"
          onClick={() => fte?.demoJump(fte?.getDemoElapsedTime() - 5)}
        >
          - 5 sec
        </button>
        <PlayToggle />
        <button
          className="bg-slate-700 p-2 py-1.5 rounded"
          onClick={() => fte?.demoJump(fte?.getDemoElapsedTime() + 5)}
        >
          + 5 sec
        </button>
        <button
          className="bg-slate-700 p-2 py-1.5 rounded"
          onClick={() => fte?.demoJump(to)}
        >
          <FontAwesomeIcon icon={faForwardStep} fixedWidth />
        </button>

        <button
          className="bg-slate-700 p-2 py-1.5 rounded"
          onClick={() => setTimeTo(fte?.getDemoElapsedTime())}
        >
          Set end
        </button>

        <button
          data-url={`https://asdasdasdasd?demoId=x&from=${from}&to=${to}`}
          className="bg-slate-700 p-2 py-1.5 rounded"
        >
          <FontAwesomeIcon icon={faCopy} fixedWidth className="mr-1" />
          Copy link
        </button>
      </div>
    </div>
  );
};
