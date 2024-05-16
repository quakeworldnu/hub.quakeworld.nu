import { filterServers } from "@qwhub/serverFilters";
import { createSelector } from "@reduxjs/toolkit";

export const selectServerFilters = (state) => state.settings.serverFilters;
export const selectServers = (state) =>
  state.hub.queries["getServers(null)"]?.data ?? [];

export const selectFilteredServers = createSelector(
  selectServerFilters,
  selectServers,
  (filters, servers) => filterServers(servers, filters),
);

export const selectFilteredClients = createSelector(
  selectFilteredServers,
  (servers) => {
    const clients = [];

    function addClient(name, name_color, status, address) {
      clients.push({
        name,
        name_color,
        status,
        address,
      });
    }

    for (const server of servers) {
      const address = server.address;

      for (const client of server.players) {
        if (!client.is_bot) {
          addClient(client.name, client.name_color, "Playing", address);
        }
      }

      for (const clientName of server.spectator_names) {
        addClient(clientName, "", "Spectating", address);
      }

      for (const clientName of server.qtv_stream.spectator_names) {
        addClient(clientName, "", "Spectating (QTV)", address);
      }
    }

    clients.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    return clients;
  },
);
