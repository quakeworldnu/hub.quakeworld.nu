import type { Player } from "@/lib/fte/types";

export function getPlayerColor(color: number): number {
  if (color < 0 || color > 16) {
    return 0;
  }
  return color;
}

export function getPlayersMajorityColor(players: Player[]): {
  topcolor: number;
  bottomcolor: number;
} {
  if (players.length === 0) {
    return { topcolor: 0, bottomcolor: 0 };
  }
  if (players.length === 1) {
    return {
      topcolor: players[0].topcolor,
      bottomcolor: players[0].bottomcolor,
    };
  }

  const colorPairs = players.map(
    (p: Player) => `${p.topcolor}-${p.bottomcolor}`,
  );
  const countPerPair: { [key: string]: number } = {};

  for (const element of colorPairs) {
    if (countPerPair[element]) {
      countPerPair[element] += 1;
    } else {
      countPerPair[element] = 1;
    }
  }

  const majorityColorPair = Object.keys(countPerPair).reduce((a, b) =>
    countPerPair[a] >= countPerPair[b] ? a : b,
  );

  const [topcolor, bottomcolor] = majorityColorPair
    .split("-")
    .map((x) => Number.parseInt(x, 10));

  return { topcolor, bottomcolor };
}

if (import.meta.vitest) {
  const { expect, test } = import.meta.vitest;
  const player = (topcolor: number, bottomcolor: number) =>
    ({ topcolor, bottomcolor }) as Player;

  test("getPlayerColor", () => {
    expect(getPlayerColor(4)).toBe(4);
    expect(getPlayerColor(-1)).toBe(0);
    expect(getPlayerColor(17)).toBe(0);
  });

  test("getPlayersMajorityColor", () => {
    expect(getPlayersMajorityColor([])).toEqual({
      topcolor: 0,
      bottomcolor: 0,
    });
    expect(getPlayersMajorityColor([player(4, 11)])).toEqual({
      topcolor: 4,
      bottomcolor: 11,
    });
    expect(
      getPlayersMajorityColor([player(4, 11), player(13, 13), player(13, 13)]),
    ).toEqual({ topcolor: 13, bottomcolor: 13 });
  });
}
