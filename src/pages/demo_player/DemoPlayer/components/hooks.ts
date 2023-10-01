import { useCounter, useInterval } from "usehooks-ts";

export function useUpdateInterval(interval: number) {
  const { count, increment } = useCounter(0);
  useInterval(increment, interval);
  return count;
}
