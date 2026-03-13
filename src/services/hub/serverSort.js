export const compareServers = (a, b) => {
  // score
  if (a.score > b.score) {
    return -1;
  }
  if (a.score < b.score) {
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
