import { useEffect } from "react";

export function useWakeLock() {
  useEffect(() => {
    async function requestWakeLock() {
      try {
        await navigator.wakeLock.request("screen");
      } catch {}
    }

    requestWakeLock();
  }, []);
}
