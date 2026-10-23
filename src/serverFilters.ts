import { isBot } from "@qwhub/services/qworld/server.ts";
import type { Server } from "@qwhub/services/qworld/types.ts";
import { localStorageGet } from "@qwhub/util";

export type ServerFilters = {
  only_bots: boolean;
  modes: string[];
  regions: string[];
};

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

export function getDefaultServerFilters(): ServerFilters {
  const defaultValues: ServerFilters = {
    only_bots: true,
    modes: [...modes],
    regions: [...regions],
  };
  return Object.assign({}, defaultValues);
}

export function getInitialServerFilters(): ServerFilters {
  return Object.assign(
    {},
    getDefaultServerFilters(),
    localStorageGet<Partial<ServerFilters>>("serverFilters", {}),
  );
}

export function filterServers(
  servers: Server[],
  filters: ServerFilters,
): Server[] {
  if (0 === servers.length) {
    return servers;
  }

  const filterOperations: ((s: Server) => boolean)[] = [];

  // misc
  if (!filters.only_bots) {
    const hasOnlyBots = (s: Server) =>
      s.players.length > 0 && s.players.every(isBot);
    filterOperations.push((s) => !hasOnlyBots(s));
  }

  // modes
  const gameModesExcludingOthers = modes.slice(0, -1);

  if (filters.modes.length !== modes.length) {
    for (const mode of modes) {
      const includeMode = filters.modes.includes(mode);
      if (!includeMode) {
        if ("other" === mode) {
          filterOperations.push((s) =>
            gameModesExcludingOthers.includes(s.meta.mode),
          );
        } else {
          filterOperations.push((s) => s.meta.mode !== mode);
        }
      }
    }
  }

  // regions
  if (filters.regions.length !== regions.length) {
    for (const region of regions) {
      const includeRegion = filters.regions.includes(region);
      if (!includeRegion) {
        filterOperations.push((s) => s.meta.geo.region !== region);
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

export function equalsDefaultFilters(filters: ServerFilters): boolean {
  return (
    filters.regions.length === regions.length &&
    filters.modes.length === modes.length &&
    filters.only_bots
  );
}
