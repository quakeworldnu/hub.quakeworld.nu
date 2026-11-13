import { useEffect, useState } from "react";

// public (no auth), cors enabled for hub.quakeworld.nu
const STREAM_URL = "https://qwleague.com/api/public/stream";

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
    // connect exactly once: qwleague.com rate limits this endpoint, so we
    // never retry. the browser would otherwise reconnect by itself on a
    // dropped connection, hence the close() in onerror.
    const source = new EventSource(STREAM_URL);
    source.addEventListener("queue_stats", (event) => {
      setStats(JSON.parse(event.data));
    });
    source.onerror = () => {
      source.close();
    };

    return () => {
      source.close();
    };
  }, []);

  return stats;
}
