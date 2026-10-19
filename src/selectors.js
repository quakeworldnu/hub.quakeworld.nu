import { filterServers } from "@qwhub/serverFilters";
import { totalSpectatorCount } from "@qwhub/servers/util.ts";
import { qworldApi } from "@qwhub/services/qworld/api";
import { isBot } from "@qwhub/services/qworld/server";
import { createSelector } from "@reduxjs/toolkit";

const selectServersResult = qworldApi.endpoints.getServers.select(null);
const noServers = [];

export const selectServerFilters = (state) => state.settings.serverFilters;
export const selectServers = (state) =>
  selectServersResult(state).data ?? noServers;

export const selectQtvServers = createSelector(selectServers, (servers) => {
  const result = servers.filter((s) => s.qtv_stream !== null);
  result.sort((b, a) => {
    const countDiff = totalSpectatorCount(a) - totalSpectatorCount(b);
    return countDiff === 0 ? a.score - b.score : countDiff;
  });
  return result;
});

export const selectFilteredServers = createSelector(
  selectServerFilters,
  selectServers,
  (filters, servers) => filterServers(servers, filters),
);

export const selectFilteredClients = createSelector(
  selectFilteredServers,
  (servers) => {
    const clients = [];

    function addClient(name, status, address) {
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
  },
);
