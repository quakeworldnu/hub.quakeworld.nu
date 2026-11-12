import type { Geo } from "./types";

// quakeworld lan in radomsko, poland (no geoip data for its servers)
export const RADOMSKO_HOST_PREFIX = "play.qwlan.pl";

export const radomskoGeo: Geo = {
  cc: "PL",
  country: "Poland",
  region: "Europe",
  city: "Radomsko",
  coordinates: [51.0667, 19.45],
};

export function isRadomskoHost(...hosts: (string | undefined)[]): boolean {
  return hosts.some((h) =>
    (h ?? "").trim().toLowerCase().startsWith(RADOMSKO_HOST_PREFIX),
  );
}

// ip => radomsko hostname, e.g. "213.76.101.30:28501" => "play.qwlan.pl:28501"
export function toRadomskoAddress(address: string, ip: string): string {
  return address.replace(ip, RADOMSKO_HOST_PREFIX);
}

if (import.meta.vitest) {
  const { expect, test } = import.meta.vitest;

  test("isRadomskoHost", () => {
    expect(isRadomskoHost("play.qwlan.pl:28501")).toBe(true);
    expect(isRadomskoHost(undefined, " PLAY.qwlan.pl #2")).toBe(true);
    expect(isRadomskoHost("qw.foppa.dk:28501", undefined)).toBe(false);
    expect(isRadomskoHost("x.play.qwlan.pl")).toBe(false);
  });

  test("toRadomskoAddress", () => {
    expect(toRadomskoAddress("213.76.101.30:28501", "213.76.101.30")).toBe(
      "play.qwlan.pl:28501",
    );
    expect(toRadomskoAddress("2@213.76.101.30:28000", "213.76.101.30")).toBe(
      "2@play.qwlan.pl:28000",
    );
  });
}
