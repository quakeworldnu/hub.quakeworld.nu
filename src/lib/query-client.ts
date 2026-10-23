import { QueryClient } from "@tanstack/react-query";

// no retries and no automatic refetching on mount/focus/reconnect,
// unused data is kept for 60s. polling and focus refetching are opt-in per query.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: 60_000,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});
