export const compareServers = (a, b) => {
  if (a.meta.score > b.meta.score) {
    return -1;
  } else if (a.meta.score < b.meta.score) {
    return 1;
  }

  // player slots
  if (a.PlayerSlots.Free < b.PlayerSlots.Free) {
    return -1;
  } else if (a.PlayerSlots.Free > b.PlayerSlots.Free) {
    return 1;
  }

  // Address
  if (a.Address < b.Address) {
    return -1;
  } else if (a.Address > b.Address) {
    return 1;
  }

  return 0;
};
