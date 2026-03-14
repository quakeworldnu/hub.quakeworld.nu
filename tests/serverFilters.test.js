import {describe, expect, test} from "vitest";

import {
  equalsDefaultFilters,
  filterServers,
  getDefaultServerFilters,
  getInitialServerFilters,
} from "../src/serverFilters";

// mock servers
const s_1on1_africa = {
  mode: "1on1",
  geo: { region: "Africa" },
  players: [],
};
const s_2on2_europe = {
  mode: "2on2",
  geo: { region: "Europe" },
  players: [],
};
const s_ffa_europe_bots_and_players = {
  mode: "ffa",
  geo: { region: "Europe" },
  players: [{ is_bot: true }, { is_bot: true }],
};
const s_ffa_europe_only_bots = {
  mode: "ffa",
  geo: { region: "Europe" },
  players: [{ is_bot: true }, { is_bot: true }],
};
const s_racing_europe = {
  mode: "racing",
  geo: { region: "Europe" },
  players: [],
};
const s_other_oceania = {
  mode: "foo",
  geo: { region: "Oceania" },
  players: [],
};

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
