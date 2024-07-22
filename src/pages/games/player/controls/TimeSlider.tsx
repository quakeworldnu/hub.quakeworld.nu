import * as Slider from "@radix-ui/react-slider";
import { useMouse, useThrottle } from "@uidotdev/usehooks";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { getTrackBackground } from "react-range";
import { useEventListener, useHover } from "usehooks-ts";
import { useFteController } from "../../fte/hooks.ts";
import { useUpdateInterval, useUrlClipParams } from "../../hooks.ts";
import { formatElapsed } from "../../time.ts";
import { useClipEditor } from "../clips/context.tsx";

export function TimeSlider() {
  const fte = useFteController();
  const sliderWrapperRef = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isHover = useHover(sliderWrapperRef);
  const [mouse, sliderRootRef] = useMouse<HTMLDivElement>();

  const countdownLength = fte ? fte.getCountdownDuration() : 10;
  const maxValue = fte ? fte.getDemoDuration() : 1210;

  useEffect(() => {
    if (!isHover || !tooltipRef.current) {
      return;
    }

    const sliderWidth = sliderRootRef.current.getBoundingClientRect().width;
    const progress = mouse.elementX / sliderWidth;
    const seekTime = Math.round(progress * maxValue);

    tooltipRef.current.textContent = formatElapsed(seekTime - countdownLength);
    tooltipRef.current.style.left = `${mouse.elementX - 10}px`; // -10 to center tooltip
  }, [isHover, mouse.elementX]);

  return (
    <>
      <div
        className={classNames(
          { hidden: !isHover },
          "absolute bottom-24 text-xs font-mono px-2 py-1 bg-violet-800 text-white rounded z-50",
        )}
        ref={tooltipRef}
      />
      <div className="w-full" ref={sliderWrapperRef}>
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

  if (clipEditorEnabled) {
    range = clipRange;
  } else if (hasParams) {
    range = [from, to];
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
            colors: ["#444", "#80f", "#444"],
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
