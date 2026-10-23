export function getMapshotUrl(map: string): string {
  return `https://assets.quake.world/mapshots/sm/${map}.webp`;
}

export function getMapshotCssUrl(map: string): string {
  return `url(${getMapshotUrl(map)})`;
}
