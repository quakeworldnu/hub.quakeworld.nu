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

export function demoUrlToQuakeRelativePath(demoUrl: string): string {
  const needle = "/qw/demos/";
  return demoUrl.includes(needle) ? demoUrl.split(needle)[1] : demoUrl;
}

export function demoFilenameToTitle(demoFilename: string): string {
  return titlelize(demoFilename);
}

export function demoUrlToTitle(demoUrl: string): string {
  if (0 === demoUrl.trim().length) {
    return "";
  }

  return titlelize(demoUrlToQuakeRelativePath(demoUrl));
}

export function titlelize(value: string): string {
  return value
    .replaceAll("/", " / ")
    .replaceAll("_", " ")
    .replace(/(\[.+])/gm, " $1 ")
    .replace(".mvd", "")
    .trim();
}
