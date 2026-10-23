import { localStorageGet } from "@/lib/local-storage";
import { isBot } from "./server";
import type { Server } from "./types";

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

if (import.meta.vitest) {
  const { describe, expect, test } = import.meta.vitest;

  // mock servers
  const s_1on1_africa = {
    meta: { mode: "1on1", geo: { region: "Africa" } },
    players: [],
  } as unknown as Server;
  const s_2on2_europe = {
    meta: { mode: "2on2", geo: { region: "Europe" } },
    players: [],
  } as unknown as Server;
  const s_ffa_europe_bots_and_players = {
    meta: { mode: "ffa", geo: { region: "Europe" } },
    players: [{ bot: { skill: 10 } }, { bot: { skill: 10 } }],
  } as unknown as Server;
  const s_ffa_europe_only_bots = {
    meta: { mode: "ffa", geo: { region: "Europe" } },
    players: [{ bot: { skill: 10 } }, { bot: { skill: 10 } }],
  } as unknown as Server;
  const s_racing_europe = {
    meta: { mode: "racing", geo: { region: "Europe" } },
    players: [],
  } as unknown as Server;
  const s_other_oceania = {
    meta: { mode: "foo", geo: { region: "Oceania" } },
    players: [],
  } as unknown as Server;

  const servers = [
    s_1on1_africa,
    s_2on2_europe,
    s_ffa_europe_bots_and_players,
    s_ffa_europe_only_bots,
    s_racing_europe,
    s_other_oceania,
  ];

  test("getDefaultServerFilters", () => {
    expect(getDefaultServerFilters()).toEqual({
      only_bots: true,
      modes: ["1on1", "2on2", "4on4", "ffa", "race", "fortress", "other"],
      regions: [
        "Africa",
        "Asia",
        "Europe",
        "North America",
        "Oceania",
        "South America",
      ],
    });
  });

  test("getInitialServerFilters", () => {
    localStorage.setItem(
      "serverFilters",
      JSON.stringify({
        modes: ["ffa", "other"],
        regions: ["Europe"],
      }),
    );

    expect(getInitialServerFilters()).toEqual({
      only_bots: true,
      modes: ["ffa", "other"],
      regions: ["Europe"],
    });
  });

  test("equalsDefaultFilters", () => {
    const filters = getDefaultServerFilters();
    expect(equalsDefaultFilters(filters)).toBeTruthy();

    filters.modes = ["ffa"];
    expect(equalsDefaultFilters(filters)).toBeFalsy();
  });

  describe("filterServers", () => {
    test("default filters", () => {
      const filters = getDefaultServerFilters();
      expect(filterServers([], filters)).toEqual([]);
      expect(filterServers(servers, filters)).toEqual(servers);
    });

    test("only bots filter", () => {
      const filters = getDefaultServerFilters();

      // include
      filters.only_bots = true;
      expect(filterServers(servers, filters)).toEqual(servers);

      // exclude
      filters.only_bots = false;
      expect(
        filterServers(servers, filters).includes(s_ffa_europe_only_bots),
      ).toBeFalsy();

      // servers without players (spectators only) are not bot servers
      expect(
        filterServers(servers, filters).includes(s_1on1_africa),
      ).toBeTruthy();
    });

    test("filter by mode", () => {
      // specific modes
      const filters = getDefaultServerFilters();
      filters.modes = ["2on2", "ffa"];

      expect(filterServers(servers, filters)).toEqual([
        s_2on2_europe,
        s_ffa_europe_bots_and_players,
        s_ffa_europe_only_bots,
      ]);
    });

    test("filter by region", () => {
      const filters = getDefaultServerFilters();

      // specific regions
      filters.regions = ["Africa"];
      expect(filterServers(servers, filters)).toEqual([s_1on1_africa]);

      // no regions
      filters.regions = [];
      expect(filterServers(servers, filters)).toEqual([]);
    });
  });
}
