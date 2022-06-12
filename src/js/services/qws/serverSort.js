export const compareServers = (a, b) => {
  if (a.meta.score > b.meta.score) {
    return -1;
  } else if (a.meta.score < b.meta.score) {
    return 1;
  }

  if (a.address < b.address) {
    return -1;
  } else if (a.address > b.address) {
    return 1;
  }

  return 0;
};
