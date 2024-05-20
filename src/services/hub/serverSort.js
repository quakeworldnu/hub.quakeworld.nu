export const compareServers = (a, b) => {
  // score
  if (a.score > b.score) {
    return -1;
  }
  if (a.score < b.score) {
    return 1;
  }

  // geo
  const aIsInEurope = a.geo.region === "Europe";
  const bIsInEurope = b.geo.region === "Europe";
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
