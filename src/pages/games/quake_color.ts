import { Player } from "./fte/types.ts";

export function getPlayerColor(color: number): number {
  if (color < 0 || color > 13) {
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
