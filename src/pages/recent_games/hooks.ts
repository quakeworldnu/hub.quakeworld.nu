import { useCounter, useElementSize, useInterval } from "usehooks-ts";
import { useThrottle } from "react-use";

export function useUpdateInterval(delay: number | null) {
  const { count, increment } = useCounter(0);
  useInterval(increment, delay);
  return count;
}

// export function useDebouncedElementSize(delay: number = 200) {
//   const [ref, size_] = useElementSize();
//   const size = useDebounce(size_, delay);
//   return [ref, size];
// }

export function useThrottledElementSize(rate: number = 200) {
  const [ref, size_] = useElementSize();
  const size = useThrottle(size_, rate);
  return [ref, size];
}
