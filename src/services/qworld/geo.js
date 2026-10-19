const GEO_URL =
  "https://raw.githubusercontent.com/vikpe/qw-servers-geoip/refs/heads/main/ip_to_geo.json";
const MAX_AGE_MS = 60 * 60 * 1000;

const emptyGeo = {
  cc: "",
  country: "",
  region: "",
  city: "",
  coordinates: [0, 0],
};

let geoByIp = {};
let fetchedAt = 0;
let pending = null;

// ip => geo, updated daily upstream, refetched hourly
export async function fetchGeo() {
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

export const geoByIpOrEmpty = (geo, ip) => geo[ip] ?? emptyGeo;
