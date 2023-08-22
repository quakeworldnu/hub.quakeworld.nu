import { createSelector } from "@reduxjs/toolkit";
import { filterServers } from "@qwhub/serverFilters";

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

    function addClient(name, name_color = "", status, address) {
      clients.push({
        name,
        name_color,
        status,
        id: [address, status, name, name_color].join("-"),
        address,
      });
    }

    servers.forEach((server) => {
      const address = server.address;

      server.players.forEach((client) => {
        if (!client.is_bot) {
          addClient(client.name, client.name_color, "Playing", address);
        }
      });

      server.spectator_names.forEach((clientName) => {
        addClient(clientName, "", "Spectating", address);
      });

      server.qtv_stream.spectator_names.forEach((clientName) => {
        addClient(clientName, "", "Spectating (QTV)", address);
      });
    });

    clients.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    return clients;
  },
);
