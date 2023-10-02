import { useCounter, useInterval } from "usehooks-ts";
import { useState } from "react";

export function useUpdateInterval(delay: number) {
  const { count, increment } = useCounter(0);
  useInterval(increment, delay);
  return count;
}

export function useResultByInterval(getValue: () => number, delay: number) {
  const [value, setValue] = useState(getValue());
  useInterval(() => {
    setValue(getValue());
  }, delay);
  return value;
}
