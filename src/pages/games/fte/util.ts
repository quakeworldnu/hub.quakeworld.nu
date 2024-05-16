import type { PlayerInfo } from "./types.ts";

export function getPlayersMajorityColor(players: PlayerInfo[]): {
  top_color: number;
  bottom_color: number;
} {
  if (players.length === 0) {
    return { top_color: 0, bottom_color: 0 };
  }
  if (players.length === 1) {
    return {
      top_color: players[0].top_color,
      bottom_color: players[0].bottom_color,
    };
  }

  const colorPairs = players.map(
    (p: PlayerInfo) => `${p.top_color}-${p.bottom_color}`,
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

  const [top_color, bottom_color] = majorityColorPair
    .split("-")
    .map((x) => Number.parseInt(x, 10));

  return { top_color, bottom_color };
}
