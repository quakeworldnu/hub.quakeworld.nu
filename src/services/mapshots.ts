export function getMapshotUrl(map: string): string {
  return `https://raw.githubusercontent.com/vikpe/qw-mapshots/main/${map}.jpg`;
}

export function getMapshotCssUrl(map: string): string {
  return `url(${getMapshotUrl(map)})`;
}
