export const ASSETS_BASE_URL: string = import.meta.env
  .VITE_ASSETS_CLOUDFRONT_URL;

export function getAssetUrl(path: string): string {
  const path_ = path.replace("#", "%23").replace("+", "%2B");
  return `${ASSETS_BASE_URL}/${path_}`;
}
