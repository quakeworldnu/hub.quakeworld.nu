import { localStorageGet } from "@qwhub/util";

export const modes = [
  "1on1",
  "2on2",
  "4on4",
  "ffa",
  "race",
  "fortress",
  "other",
];

export const regions = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

export function getDefaultServerFilters() {
  const defaultValues = {
    only_bots: true,
    modes: [...modes],
    regions: [...regions],
  };
  return Object.assign({}, defaultValues);
}

export function getInitialServerFilters() {
  return Object.assign(
    {},
    getDefaultServerFilters(),
    localStorageGet("serverFilters", {}),
  );
}

export function filterServers(servers, filters) {
  if (0 === servers.length) {
    return servers;
  }

  const filterOperations = [];

  // misc
  if (!filters.only_bots) {
    filterOperations.push((s) => !s.players.every((p) => p.is_bot));
  }

  // modes
  const gameModesExcludingOthers = modes.slice(0, -1);

  if (filters.modes.length !== modes.length) {
    for (const mode of modes) {
      const includeMode = filters.modes.includes(mode);
      if (!includeMode) {
        if ("other" === mode) {
          filterOperations.push((s) =>
            gameModesExcludingOthers.includes(s.mode),
          );
        } else {
          filterOperations.push((s) => s.mode !== mode);
        }
      }
    }
  }

  // regions
  if (filters.regions.length !== regions.length) {
    for (const region of regions) {
      const includeRegion = filters.regions.includes(region);
      if (!includeRegion) {
        filterOperations.push((s) => s.geo.region !== region);
      }
    }
  }

  // apply filters
  let filtered_servers = servers;

  for (const filterOp of filterOperations) {
    if (filtered_servers.length === 0) {
      return filtered_servers;
    }
    filtered_servers = filtered_servers.filter(filterOp);
  }

  return filtered_servers;
}

export function equalsDefaultFilters(filters) {
  return (
    filters.regions.length === regions.length &&
    filters.modes.length === modes.length &&
    filters.only_bots
  );
}
