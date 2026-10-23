import * as Slider from "@radix-ui/react-slider";
import classNames from "classnames";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { getTrackBackground } from "react-range";
import { useEventListener, useHover } from "usehooks-ts";
import { useFteController } from "../../fte/hooks.ts";
import {
  useThrottle,
  useUpdateInterval,
  useUrlClipParams,
} from "../../hooks.ts";
import { formatElapsed } from "../../time.ts";
import { useClipEditor } from "../clips/context.tsx";
import { useClipPlaylist } from "../clips/playlist.tsx";

export function TimeSlider() {
  const fte = useFteController();
  const sliderWrapperRef = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isHover = useHover(sliderWrapperRef);
  const sliderRootRef = useRef<HTMLDivElement | null>(null);

  const countdownLength = fte ? fte.getCountdownDuration() : 10;
  const maxValue = fte ? fte.getDemoDuration() : 1210;

  // update tooltip directly (no re-render), only while hovering the slider
  function handleMouseMove(e: MouseEvent) {
    if (!tooltipRef.current || !sliderRootRef.current) {
      return;
    }

    const { left, width: sliderWidth } =
      sliderRootRef.current.getBoundingClientRect();
    const elementX = e.pageX - (left + window.scrollX);
    const progress = elementX / sliderWidth;
    const seekTime = Math.round(progress * maxValue);

    tooltipRef.current.textContent = formatElapsed(seekTime - countdownLength);
    tooltipRef.current.style.left = `${elementX - 10}px`; // -10 to center tooltip
  }

  return (
    <>
      <div
        className={classNames(
          { hidden: !isHover },
          "absolute bottom-24 text-xs font-mono px-2 py-1 bg-violet-800 text-white rounded z-50",
        )}
        ref={tooltipRef}
      />
      <div
        className="w-full"
        ref={sliderWrapperRef}
        onMouseMove={handleMouseMove}
      >
        <div ref={sliderRootRef}>
          <SliderRoot max={maxValue} />
        </div>
      </div>
    </>
  );
}

const SliderRoot = ({ max }: { max: number }) => {
  const fte = useFteController();
  const documentRef = useRef<Document>(document);
  const { range: clipRange, isEnabled: clipEditorEnabled } = useClipEditor();
  const { from, to, hasParams } = useUrlClipParams();
  const { clips } = useClipPlaylist();
  const [jump, setJump] = useState<number>(-1);
  const throttledJump = useThrottle(jump, 200);
  useUpdateInterval(fte ? 100 : null);

  // keyboard shortcuts
  useEventListener(
    "keydown",
    (e: KeyboardEvent) => {
      if (!fte || fte.isConsoleOpen()) {
        return;
      }

      const jumpDelta = e.shiftKey ? 10 : 1;

      switch (e.key) {
        case "ArrowLeft":
          return setJump(fte.getDemoElapsedTime() - jumpDelta);
        case "ArrowRight":
          return setJump(fte.getDemoElapsedTime() + jumpDelta);
        default:
          break;
      }
    },
    documentRef,
  );

  useEffect(() => {
    if (fte) {
      if (jump < 0) {
        return;
      }
      fte.demoJump(throttledJump);
    }
  }, [fte, throttledJump]);

  if (!fte) {
    return null;
  }

  function handleValueChange(values: number[]) {
    if (fte && values.length > 0) {
      setJump(values[0]);
    }
  }

  const min = 0;
  let range = [0, 0];
  let rangeColors = ["#444", "#80f", "#444"];

  if (clipEditorEnabled) {
    range = clipRange;
  } else if (hasParams) {
    range = [from, to];
  } else if (clips.length > 0) {
    range = mergeRanges(clips.map((c) => [c.from, c.to])).flat();
    rangeColors = [...range.map((_, i) => (i % 2 ? "#80f" : "#444")), "#444"];
  }

  const useRange = range[1] > 0;

  return (
    <Slider.Root
      className="relative flex items-center select-none touch-none w-full h-8 group cursor-pointer transition-opacity duration-500"
      value={[fte.getDemoElapsedTime()]}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      step={1}
    >
      <div
        className={classNames("absolute w-full h-2", {
          "opacity-0": !useRange,
        })}
        style={{
          background: getTrackBackground({
            values: range,
            colors: rangeColors,
            min,
            max,
          }),
        }}
      />

      <Slider.Track
        className={classNames(
          "relative grow h-1 transition-size group-hover:h-2 bg-gray-500",
          { "opacity-0": useRange },
        )}
      >
        <Slider.Range
          className={classNames(
            "absolute h-full bg-violet-700 group-hover:bg-violet-600",
            { "opacity-0": useRange },
          )}
        />
      </Slider.Track>

      <Slider.Thumb
        className={classNames(
          "block w-1 focus:outline-none pointer-events-none transition-size",
          {
            "h-5 bg-white": useRange,
            "h-3 bg-violet-500 group-hover:bg-white group-hover:h-5": !useRange,
          },
        )}
      />
    </Slider.Root>
  );
};

// sorted, non-overlapping ranges (required by getTrackBackground)
function mergeRanges(ranges: number[][]): number[][] {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [];

  for (const [from, to] of sorted) {
    const last = merged[merged.length - 1];

    if (last && from <= last[1]) {
      last[1] = Math.max(last[1], to);
    } else {
      merged.push([from, to]);
    }
  }

  return merged;
}
