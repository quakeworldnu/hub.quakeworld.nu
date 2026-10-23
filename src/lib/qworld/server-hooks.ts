import { useMemo } from "react";
import { useServerFilters } from "@/stores/settings";
import { useServers } from "./queries";
import { isBot } from "./server";
import { filterServers } from "./server-filters";
import { totalSpectatorCount } from "./server-utils";
import type { QuakeString, Server } from "./types";

export function useFilteredServers(): Server[] {
  const servers = useServers();
  const filters = useServerFilters();
  return useMemo(() => filterServers(servers, filters), [servers, filters]);
}

export function useQtvServers(): Server[] {
  const servers = useServers();

  return useMemo(() => {
    const result = servers.filter((s) => s.qtv_stream !== null);
    result.sort((b, a) => {
      const countDiff = totalSpectatorCount(a) - totalSpectatorCount(b);
      return countDiff === 0 ? a.score - b.score : countDiff;
    });
    return result;
  }, [servers]);
}

export type Client = {
  name: QuakeString;
  status: string;
  address: string;
};

export function useFilteredClients(): Client[] {
  const servers = useFilteredServers();

  return useMemo(() => {
    const clients: Client[] = [];

    function addClient(name: QuakeString, status: string, address: string) {
      clients.push({ name, status, address });
    }

    for (const server of servers) {
      const address = server.address;

      for (const player of server.players) {
        if (!isBot(player)) {
          addClient(player.name, "Playing", address);
        }
      }

      for (const spectator of server.spectators) {
        addClient(spectator.name, "Spectating", address);
      }

      for (const clientName of server.qtv_stream?.client_names ?? []) {
        addClient(clientName, "Spectating (QTV)", address);
      }
    }

    clients.sort((a, b) => {
      return a.name.ascii
        .toLowerCase()
        .localeCompare(b.name.ascii.toLowerCase());
    });

    return clients;
  }, [servers]);
}
