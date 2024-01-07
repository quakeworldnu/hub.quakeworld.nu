import { FteAssets } from "./types.ts";

const FTE_ASSETS_URL =
  "https://raw.githubusercontent.com/vikpe/fte-web-assets/main";

export function getMapTextures(mapName: string): FteAssets {
  const filenames = texturesPerMapName[mapName] ?? [];
  const filepaths = filenames.map((t) => `id1/textures/${mapName}/${t}`);
  const assets: FteAssets = {};

  for (const path of filepaths) {
    assets[path] = `${FTE_ASSETS_URL}/${path.replace("#", "%23")}`;
  }

  return assets;
}

const texturesPerMapName: { [key: string]: string[] } = {
  schloss: ["016.jpg", "017.jpg", "019.jpg", "020.jpg", "040.jpg", "107.jpg"],
};
