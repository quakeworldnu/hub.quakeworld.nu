import type { Server } from "./types";

export const compareServers = (a: Server, b: Server): number => {
  // score
  if (a.score > b.score) {
    return -1;
  }
  if (a.score < b.score) {
    return 1;
  }

  // geo
  const aIsInEurope = a.meta.geo.region === "Europe";
  const bIsInEurope = b.meta.geo.region === "Europe";
  if (aIsInEurope && !bIsInEurope) {
    return -1;
  }
  if (!aIsInEurope && bIsInEurope) {
    return 1;
  }

  // address
  if (a.address < b.address) {
    return -1;
  }
  if (a.address > b.address) {
    return 1;
  }

  return 0;
};
