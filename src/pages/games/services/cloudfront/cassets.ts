export const ASSETS_BASE_URL: string = import.meta.env
  .VITE_ASSETS_CLOUDFRONT_URL;

export function getAssetUrl(path: string): string {
  const path_ = path.replaceAll("#", "%23").replaceAll("+", "%2B");
  return `${ASSETS_BASE_URL}/${path_}`;
}
