import { useEffect, useState } from "react";

// public (no auth), cors enabled for hub.quakeworld.nu
const STREAM_URL = "https://qwleague.com/api/public/stream";

const MIN_RETRY_DELAY = 2_000;
const MAX_RETRY_DELAY = 60_000;

// payload of the "queue_stats" event on STREAM_URL
// note: a player can queue for several modes/regions at once, so the
// per-mode and per-region counts overlap and do not sum to `waiting`.
export type QueueStats = {
  waiting: number;
  by_mode: Record<string, number>;
  by_mode_region: Record<string, Record<string, number>>;
  by_mode_continent: Record<string, Record<string, number>>;
  matchmaking_enabled: boolean;
};

export function useQueueStats(): QueueStats | null {
  const [stats, setStats] = useState<QueueStats | null>(null);

  useEffect(() => {
    let source: EventSource | null = null;
    let retryTimeout: ReturnType<typeof setTimeout> | undefined;
    let retryDelay = MIN_RETRY_DELAY;
    let isClosed = false;

    function connect() {
      source = new EventSource(STREAM_URL);
      source.addEventListener("queue_stats", (event) => {
        retryDelay = MIN_RETRY_DELAY;
        setStats(JSON.parse(event.data));
      });
      source.onerror = () => {
        // the browser retries dropped connections itself, but gives up
        // (CLOSED) on http errors, e.g. 401 or a blocked CORS request
        if (source?.readyState === EventSource.CLOSED) {
          source = null;
          reconnect();
        }
      };
    }

    function reconnect() {
      if (isClosed) {
        return;
      }

      retryTimeout = setTimeout(connect, retryDelay);
      retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
    }

    connect();

    return () => {
      isClosed = true;
      clearTimeout(retryTimeout);
      source?.close();
    };
  }, []);

  return stats;
}
