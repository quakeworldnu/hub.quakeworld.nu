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
