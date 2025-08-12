export function getMapshotUrl(map: string): string {
  return `https://a.quake.world/mapshots/webp/sm/${map}.webp`;
}

export function getMapshotCssUrl(map: string): string {
  return `url(${getMapshotUrl(map)})`;
}
