import { useState } from "react";
import { useInterval } from "usehooks-ts";

// poll a value, re-rendering only when it changes (react bails out on identical
// state). pass a key for non-primitive values. refresh re-reads on demand
export function usePolledState<T>(
  read: () => T,
  delay: number | null,
  key: (value: T) => unknown = (value) => value,
): [T, () => void] {
  const [value, setValue] = useState(read);

  function refresh() {
    const next = read();
    setValue((prev) => (key(prev) === key(next) ? prev : next));
  }

  useInterval(refresh, delay);

  return [value, refresh];
}

export function usePolledValue<T>(
  read: () => T,
  delay: number | null,
  key?: (value: T) => unknown,
): T {
  return usePolledState(read, delay, key)[0];
}
