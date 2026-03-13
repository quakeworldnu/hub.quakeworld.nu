import {describe, expect, test} from "vitest";

import {
  equalsDefaultFilters,
  filterServers,
  getDefaultServerFilters,
  getInitialServerFilters,
} from "../src/serverFilters";

// mock servers
const s_1on1 = {
  mode: "1on1",
  players: [],
};
const s_2on2 = {
  mode: "2on2",
  players: [],
};
const s_ffa_bots_and_players = {
  mode: "ffa",
  players: [{ is_bot: true }, { is_bot: true }],
};
const s_ffa_only_bots = {
  mode: "ffa",
  players: [{ is_bot: true }, { is_bot: true }],
};
const s_racing = {
  mode: "racing",
  players: [],
};
const s_other = {
  mode: "foo",
  players: [],
};

const servers = [
  s_1on1,
  s_2on2,
  s_ffa_bots_and_players,
  s_ffa_only_bots,
  s_racing,
  s_other,
];

test("getDefaultServerFilters", () => {
  expect(getDefaultServerFilters()).toEqual({
    only_bots: true,
    modes: ["1on1", "2on2", "4on4", "ffa", "race", "fortress", "other"],
  });
});

test("getInitialServerFilters", () => {
  localStorage.setItem(
    "serverFilters",
    JSON.stringify({
      modes: ["ffa", "other"],
    }),
  );

  expect(getInitialServerFilters()).toEqual({
    only_bots: true,
    modes: ["ffa", "other"],
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
      filterServers(servers, filters).includes(s_ffa_only_bots),
    ).toBeFalsy();
  });

  test("filter by mode", () => {
    // specific modes
    const filters = getDefaultServerFilters();
    filters.modes = ["2on2", "ffa"];

    expect(filterServers(servers, filters)).toEqual([
      s_2on2,
      s_ffa_bots_and_players,
      s_ffa_only_bots,
    ]);
  });
});
