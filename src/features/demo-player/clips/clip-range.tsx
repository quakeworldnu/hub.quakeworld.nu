import { faGripLinesVertical } from "@fortawesome/free-solid-svg-icons";
import * as Slider from "@radix-ui/react-slider";
import clsx from "clsx";
import { type PointerEvent, useRef, useState } from "react";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { getTrackBackground } from "@/features/demo-player/utils/track-background";
import { useFteController } from "@/lib/fte/hooks";
import { formatElapsed } from "@/utils/time";
import { useClipEditor } from "./clip-editor";

const STEP = 1;

export const ClipRange = () => {
  const fte = useFteController();
  const { from, to, range, setRange } = useClipEditor();
  const [lastRange, setLastRange] = useState<number[]>(range);
  const [draggedIndex, setDraggedIndex] = useState<number>(-1);
  const trackRef = useRef<HTMLSpanElement>(null);
  const trackDragX = useRef<number | null>(null); // set while dragging the whole range

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

  // pressing the track (not a thumb) drags the whole range
  function handlePointerDown(e: PointerEvent) {
    if ((e.target as HTMLElement).closest('[role="slider"]')) {
      return; // thumb drag, handled by the slider
    }
    e.preventDefault(); // skip the slider's "move closest thumb" behavior
    e.currentTarget.setPointerCapture(e.pointerId);
    trackDragX.current = e.clientX;
  }

  function handlePointerMove(e: PointerEvent) {
    if (trackDragX.current === null || !trackRef.current) {
      return;
    }
    e.preventDefault();

    const trackWidth = trackRef.current.getBoundingClientRect().width;
    let delta = ((e.clientX - trackDragX.current) / trackWidth) * (max - min);

    if (Math.abs(delta) < STEP / 2) {
      return;
    }

    // keep the range within min/max
    for (const value of range) {
      if (
        (value === max && Math.sign(delta) === 1) ||
        (value === min && Math.sign(delta) === -1)
      ) {
        return;
      }
      if (value + delta > max) {
        delta = max - value;
      } else if (value + delta < min) {
        delta = min - value;
      }
    }

    trackDragX.current = e.clientX;
    setRange(
      range.map((value, index) =>
        normalizeValue(value + delta, index, min, max, range),
      ),
    );
  }

  function handlePointerUp(e: PointerEvent) {
    setDraggedIndex(-1);

    if (trackDragX.current === null) {
      return;
    }
    e.preventDefault();
    trackDragX.current = null;
    handleFinalChange(range);
  }

  return (
    <Slider.Root
      value={range}
      min={min}
      max={max}
      step={STEP}
      onValueChange={setRange}
      onValueCommit={handleFinalChange}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="flex w-full h-10 bg-bottom touch-none select-none"
      style={{
        backgroundImage:
          "url(https://clips-media-assets2.twitch.tv/img/ss-tick-45x48.png)",
        transform: "scale(1)",
      }}
    >
      <Slider.Track
        ref={trackRef}
        className="relative flex w-full h-full self-center bg-repeat-x cursor-grab [&>span:has(>[data-dragged])]:z-10"
        style={{
          background: getTrackBackground({
            values: range,
            colors: ["#0008", "#0000", "#0008"],
            min,
            max,
          }),
        }}
      >
        {range.map((value, index) => {
          const isDragged = draggedIndex === index;

          // zero-width thumb: centered on its value and allowed to overflow the track ends
          return (
            <Slider.Thumb
              key={index}
              data-dragged={isDragged || undefined}
              onPointerDown={() => setDraggedIndex(index)}
              onKeyDown={() => setDraggedIndex(index)}
              onKeyUp={() => setDraggedIndex(-1)}
              className="group relative block w-0 h-10 outline-hidden"
            >
              <div
                className="absolute -top-1 -left-2 flex w-4 h-12 justify-center items-center bg-blue-700 hover:bg-blue-800 border border-transparent hover:border-white group-focus-visible:[outline:auto]"
                style={{ cursor: "col-resize" }}
              >
                <div
                  className={clsx(
                    "absolute rounded bg-blue-900 text-white font-mono p-1 px-1.5 text-xs",
                    { "z-10": isDragged },
                  )}
                >
                  {formatElapsed(value - countdownLength)}
                </div>

                <FontAwesomeIcon
                  fixedWidth
                  icon={faGripLinesVertical}
                  className={clsx("", {
                    "text-blue-200": !isDragged,
                    "text-white": isDragged,
                  })}
                />
              </div>
            </Slider.Thumb>
          );
        })}
      </Slider.Track>
    </Slider.Root>
  );
};

// same as react-range (no overlap): clamp to neighbours and min/max, round to step
function normalizeValue(
  value: number,
  index: number,
  min: number,
  max: number,
  values: number[],
): number {
  const BIG_NUM = 10e10;
  const v = Math.round(value * BIG_NUM) / BIG_NUM;
  const prev = values[index - 1];
  const next = values[index + 1];

  if (prev && prev > v) {
    return prev;
  }
  if (next && next < v) {
    return next;
  }
  if (v > max) {
    return max;
  }
  if (v < min) {
    return min;
  }

  const remainder =
    Math.floor(v * BIG_NUM - min * BIG_NUM) % Math.floor(STEP * BIG_NUM);
  const closestLowerNum = Math.floor(v * BIG_NUM - Math.abs(remainder));
  const rounded = remainder === 0 ? v : closestLowerNum / BIG_NUM;
  const res =
    Math.abs(remainder / BIG_NUM) < STEP / 2 ? rounded : rounded + STEP;
  return Number.parseFloat(res.toFixed(0));
}
