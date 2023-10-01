import { useCounter, useInterval } from "usehooks-ts";
import { useState } from "react";

export function useUpdateInterval(interval: number) {
  const { count, increment } = useCounter(0);
  useInterval(increment, interval);
  return count;
}

export function useGametime(getGametime: () => number, delay: number) {
  const [value, setValue] = useState(getGametime());
  useInterval(() => {
    setValue(getGametime());
  }, delay);
  return value;
}
