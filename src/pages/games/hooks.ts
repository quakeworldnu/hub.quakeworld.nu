import { useEffect } from "react";
import {
  useEventListener as uhUseEventListener,
  useCounter,
  useInterval,
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
  useEffect(() => {
    async function requestWakeLock() {
      try {
        await navigator.wakeLock.request("screen");
      } catch (err) {}
    }

    requestWakeLock();
  }, []);
}

export function useCurrentGameId(): number | undefined {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get("gameId");

  if (gameId) {
    return Number.parseInt(gameId);
  }

  // legacy fallback
  const demoId = params.get("demoId");
  return demoId ? Number.parseInt(demoId) : undefined;
}

export function useUrlClipParams(): {
  from: number;
  to: number;
  track: number | string;
  hasParams: boolean;
} {
  const params = new URLSearchParams(window.location.search);
  const from = Number.parseInt(params.get("from") || "0");
  const to = Number.parseInt(params.get("to") || "0");
  const track = params.get("track") || "auto";
  const hasParams = from > 0 && to > 0;
  return { from, to, track, hasParams };
}
