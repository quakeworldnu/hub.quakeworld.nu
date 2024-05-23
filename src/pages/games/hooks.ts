import {
  useEventListener as uhUseEventListener,
  useCounter,
  useInterval,
  useEffectOnce,
} from "usehooks-ts";

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

export function useEventListener(
  eventName: string,
  handler: (event: any) => void,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  uhUseEventListener(eventName, handler);
}

export function useWakeLock() {
  useEffectOnce(() => {
    async function requestWakeLock() {
      try {
        await navigator.wakeLock.request("screen");
      } catch (err) {}
    }

    requestWakeLock();
  });
}
