import { useEffect, useRef } from "react";
import classNames from "classnames";
import * as Slider from "@radix-ui/react-slider";
import { useHover } from "usehooks-ts";
import { useMouse } from "@uidotdev/usehooks";
import { useUpdateInterval } from "../../hooks.ts";
import { useFteController } from "../../fte/hooks.ts";
import { formatSeek } from "../../time.ts";

export function TimeSlider() {
  const fte = useFteController();
  const sliderWrapperRef = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isHover = useHover(sliderWrapperRef);
  const [mouse, sliderRootRef] = useMouse<HTMLFormElement>();

  const matchStartTime = fte ? fte.getDemoGameStartTime() : 10;
  const maxValue = fte ? fte.getDemoTotalTime() : 1200;

  useEffect(() => {
    if (!isHover || !tooltipRef.current) {
      return;
    }

    const sliderWidth = sliderRootRef.current.getBoundingClientRect().width;
    const progress = mouse.elementX / sliderWidth;
    const seekTime = Math.round(progress * maxValue);

    tooltipRef.current.textContent = formatSeek(seekTime, matchStartTime);
    tooltipRef.current.style.left = `${mouse.elementX - 10}px`; // -10 to center tooltip
  }, [isHover, mouse.elementX]);

  return (
    <>
      <div
        className={classNames(
          { hidden: !isHover },
          "absolute bottom-20 text-xs font-mono px-2 py-1 bg-purple-800 text-white rounded",
        )}
        ref={tooltipRef}
      ></div>
      <div className="w-full" ref={sliderWrapperRef}>
        <form ref={sliderRootRef}>
          <SliderRoot max={maxValue} />
        </form>
      </div>
    </>
  );
}

const SliderRoot = ({ max }: { max: number }) => {
  const fte = useFteController();
  useUpdateInterval(fte ? 200 : null);

  if (!fte) {
    return null;
  }

  function handleValueChange(values: number[]) {
    if (fte && values.length > 0) {
      fte.demoJump(values[0]);
    }
  }

  return (
    <Slider.Root
      className="flex items-center select-none touch-none w-full h-8 group cursor-pointer"
      value={[fte.getDemoElapsedTime()]}
      onValueChange={handleValueChange}
      min={0}
      max={max}
      step={1}
    >
      <Slider.Track className="relative grow h-1 transition-size group-hover:h-2 bg-gray-500">
        <Slider.Range className="absolute h-full bg-purple-700 group-hover:bg-purple-600" />
      </Slider.Track>
      <Slider.Thumb className="block w-1 h-2 bg-purple-500 transition-size focus:outline-none pointer-events-none group-hover:bg-white group-hover:rounded-none group-hover:w-1 group-hover:h-5" />
    </Slider.Root>
  );
};
