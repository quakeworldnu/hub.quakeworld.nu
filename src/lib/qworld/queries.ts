import { useQuery } from "@tanstack/react-query";
import {
  fetchLastscores,
  fetchServer,
  fetchServers,
  fetchTwitchStreams,
} from "./api";
import type { Server, TwitchStream } from "./types";

// polling: one polling hook per query and page (each polling hook runs its own timer)
type Polling = {
  interval: number; // ms
  inBackground?: boolean; // keep polling while the page is hidden
  refetchOnFocus?: boolean; // refetch when the page becomes visible
};

function pollingOptions(polling?: Polling) {
  if (!polling) {
    return {};
  }

  return {
    refetchInterval: polling.interval,
    refetchIntervalInBackground: polling.inBackground ?? false,
    refetchOnWindowFocus: polling.refetchOnFocus ? ("always" as const) : false,
  };
}

const noServers: Server[] = [];
const noStreams: TwitchStream[] = [];

export function useServers(polling?: Polling): Server[] {
  const { data } = useQuery({
    queryKey: ["qworld", "servers"],
    queryFn: fetchServers,
    ...pollingOptions(polling),
  });
  return data ?? noServers;
}

export function useServer(address: string, polling?: Polling) {
  return useQuery({
    queryKey: ["qworld", "server", address],
    queryFn: () => fetchServer(address),
    ...pollingOptions(polling),
  });
}

export function useTwitchStreams(polling?: Polling): TwitchStream[] {
  const { data } = useQuery({
    queryKey: ["qworld", "twitch-streams"],
    queryFn: fetchTwitchStreams,
    ...pollingOptions(polling),
  });
  return data ?? noStreams;
}

export function useLastscores(address: string) {
  return useQuery({
    queryKey: ["qworld", "lastscores", address],
    queryFn: () => fetchLastscores(address),
  });
}
