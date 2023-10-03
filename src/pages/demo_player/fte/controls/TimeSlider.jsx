import { useEffect, useRef } from "react";
import { useHover } from "usehooks-ts";
import { useMouse } from "@uidotdev/usehooks";
import classNames from "classnames";
import * as Slider from "@radix-ui/react-slider";
import { useUpdateInterval } from "@qwhub/hooks";
import { useFteController } from "@qwhub/pages/demo_player/fte/hooks";
import { roundFloat } from "@qwhub/pages/demo_player/math";
import { secondsToMinutesAndSeconds } from "@qwhub/pages/demo_player/util";

export function TimeSlider() {
  const fte = useFteController();
  const sliderWrapperRef = useRef(null);
  const tooltipRef = useRef(null);
  const isHover = useHover(sliderWrapperRef);
  const [mouse, sliderRootRef] = useMouse();

  const maxValue = fte ? fte.getDemoTotalTime() : 60 * 20 + 10;

  useEffect(() => {
    if (!isHover) {
      return;
    }

    const sliderWidth = sliderRootRef.current.getBoundingClientRect().width;
    const progress = roundFloat(mouse.elementX / sliderWidth, 3);
    const seekTime = Math.round(progress * maxValue);

    //console.log("############## seektime", progress, seekTime);

    tooltipRef.current.textContent =
      seekTime < 10 ? "Countdown" : secondsToMinutesAndSeconds(seekTime - 10);
    tooltipRef.current.style.left = `${mouse.elementX - 10}px`; // -10 to center tooltip
  }, [isHover, mouse.elementX]);

  return (
    <div className="w-full mx-4">
      <div
        className={classNames(
          { hidden: !isHover },
          "absolute bottom-20 text-xs font-mono px-2 py-1 bg-purple-800 text-white rounded",
        )}
        ref={tooltipRef}
      ></div>
      <div className="w-full" ref={sliderWrapperRef}>
        <form ref={sliderRootRef}>
          <SliderRoot />
        </form>
      </div>
    </div>
  );
}

const SliderRoot = () => {
  const fte = useFteController();
  useUpdateInterval(fte ? 200 : null);

  if (!fte) {
    return null;
  }

  function onValueChange(values) {
    if (values.length > 0) {
      console.log("#################### onValueChange", values[0]);
      fte.demoJump(values[0]);
    }
  }

  const max = fte.getDemoTotalTime();

  return (
    <Slider.Root
      className="relative flex items-center select-none touch-none w-full h-8 group cursor-pointer transition-colors"
      value={[fte.getDemoElapsedTime()]}
      onValueChange={onValueChange}
      min={0}
      max={max}
      step={0.5}
    >
      <Slider.Track className="bg-gray-500 group-hover:bg-gray-400 relative grow h-1 group-hover:h-1.5">
        <Slider.Range className="absolute bg-purple-800 group-hover:bg-purple-700 h-full" />
      </Slider.Track>
      <Slider.Thumb
        className="block w-1 h-1 bg-purple-800 group-hover:bg-purple-600 rounded-full group-hover:w-4 group-hover:h-4 focus:outline-none transition-size duration-100"
        aria-label="Seek"
      />
    </Slider.Root>
  );
};
