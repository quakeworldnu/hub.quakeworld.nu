type MapshotWidth = 640 | 1280 | 1920;

export function getMapshotCssUrl(map: string, width: MapshotWidth): string {
  return `url(https://media.quake.world/mapshots/${width}/${map}.webp)`;
}
