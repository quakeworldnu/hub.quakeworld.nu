import type { Geo } from "./types.ts";

export type GeoByIp = Record<string, Geo>;

const GEO_URL =
  "https://raw.githubusercontent.com/vikpe/qw-servers-geoip/refs/heads/main/ip_to_geo.json";
const MAX_AGE_MS = 60 * 60 * 1000;

const emptyGeo: Geo = {
  cc: "",
  country: "",
  region: "",
  city: "",
  coordinates: [0, 0],
};

let geoByIp: GeoByIp = {};
let fetchedAt = 0;
let pending: Promise<void> | null = null;

// ip => geo, updated daily upstream, refetched hourly
export async function fetchGeo(): Promise<GeoByIp> {
  if (Date.now() - fetchedAt < MAX_AGE_MS) {
    return geoByIp;
  }

  if (!pending) {
    pending = fetch(GEO_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        geoByIp = data;
        fetchedAt = Date.now();
      })
      .catch(() => {}) // keep previous (possibly empty) geo
      .finally(() => {
        pending = null;
      });
  }

  await pending;
  return geoByIp;
}

export const geoByIpOrEmpty = (geo: GeoByIp, ip: string): Geo =>
  geo[ip] ?? emptyGeo;
