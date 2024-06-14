export function getMapshotUrl(map: string): string {
  return `https://a.quake.world/mapshots/${map}.jpg`;
}

export function getMapshotCssUrl(map: string): string {
  return `url(${getMapshotUrl(map)})`;
}
