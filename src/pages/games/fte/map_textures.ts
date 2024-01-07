const FTE_ASSETS_URL =
  "https://raw.githubusercontent.com/vikpe/fte-web-assets/main";

type TextureMap = { [key: string]: string };

export function getMapTextures(mapName: string): TextureMap {
  const filenames = texturesPerMapName[mapName] ?? [];
  const filepaths = filenames.map((t) => `id1/textures/${mapName}/${t}`);
  const result: TextureMap = {};

  for (const path of filepaths) {
    result[path] = `${FTE_ASSETS_URL}/${path.replace("#", "%23")}`;
  }

  return result;
}

const texturesPerMapName: { [key: string]: string[] } = {
  schloss: ["016.jpg", "017.jpg", "019.jpg", "020.jpg", "040.jpg", "107.jpg"],
};
