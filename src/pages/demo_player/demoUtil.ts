import { AWS_S3_BASE_URL } from "./aws.ts";

export function demoFilenameToMapName(demoFilename: string): string {
  const mapMatch = demoFilename.match(/\[(.*?)]/);

  if (mapMatch !== null) {
    return mapMatch[1];
  }

  return "";
}

export function demoUrlToFilename(url: string): string {
  const parts = url.split("/");
  return parts.length > 0 ? parts[parts.length - 1] : "";
}

export function demoUrlToTitle(demoName: string): string {
  return demoName
    .replace(`${AWS_S3_BASE_URL}/qw/demos/`, "")
    .replaceAll("/", " / ")
    .replaceAll("_", " ")
    .replace(/(\[.+])/gm, " $1 ")
    .replace(".mvd", "")
    .trim();
}
