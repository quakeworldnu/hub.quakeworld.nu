import { useMemo } from "react";
import { useServerFilters } from "@/stores/settings";
import type { ServerListShow } from "./api";
import { useServers } from "./queries";
import { filterServers } from "./server-filters";
import type { Server } from "./types";

export function useFilteredServers(show: ServerListShow = "active"): Server[] {
  const servers = useServers(undefined, show);
  const filters = useServerFilters();
  return useMemo(() => filterServers(servers, filters), [servers, filters]);
}

// servers with players and a qtv stream, highest score first
export function useQtvServers(): Server[] {
  const servers = useServers();

  return useMemo(() => {
    const result = servers.filter(
      (s) => s.qtv_stream !== null && s.players.length > 0,
    );
    result.sort((a, b) => b.score - a.score);
    return result;
  }, [servers]);
}
