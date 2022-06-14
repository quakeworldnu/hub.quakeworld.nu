export const compareServers = (a, b) => {
  // score
  if (a.score > b.score) {
    return -1;
  } else if (a.score < b.score) {
    return 1;
  }

  // geo
  let aIsInEurope = a.geo.region === "Europe";
  let bIsInEurope = b.geo.region === "Europe";
  if (aIsInEurope && !bIsInEurope) {
    return -1;
  } else if (!aIsInEurope && bIsInEurope) {
    return 1;
  }

  // address
  if (a.address < b.address) {
    return -1;
  } else if (a.address > b.address) {
    return 1;
  }

  return 0;
};
