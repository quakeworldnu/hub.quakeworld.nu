export const compareServers = (a, b) => {
  // -1 = a
  // 1 = b
  // 0 = unchanged

  // score
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

export const sortByProp = (prop, dir) => {
  const compareFunc = (a, b) => {
    const gtValue = "ASC" === dir ? 1 : -1;
    const ltValue = -gtValue;

    if (a[prop] > b[prop]) {
      return gtValue;
    } else if (a[prop] < b[prop]) {
      return ltValue;
    }
    return 0;
  };

  return compareFunc;
};
