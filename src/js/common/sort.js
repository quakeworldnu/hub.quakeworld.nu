export const compareServers = (a, b) => {
  // -1 = a
  // 1 = b
  // 0 = unchanged

  // tag
  if (a.meta.hasMatchtag && !b.meta.hasMatchtag) {
    return -1;
  } else if (!a.meta.hasMatchtag && b.meta.hasMatchtag) {
    return 1;
  }

  // player count
  if (a.meta.playerCount > b.meta.playerCount) {
    return -1;
  } else if (a.meta.playerCount < b.meta.playerCount) {
    return 1;
  }

  // spectator count
  const totalSpectatorCountForA =
    a.meta.spectatorCount + a.meta.qtvSpectatorCount;
  const totalSpectatorCountForB =
    b.meta.spectatorCount + b.meta.qtvSpectatorCount;

  if (totalSpectatorCountForA > totalSpectatorCountForB) {
    return -1;
  } else if (totalSpectatorCountForA < totalSpectatorCountForB) {
    return 1;
  }

  // is started
  if (a.meta.isStarted && !b.meta.isStarted) {
    return -1;
  } else if (!a.meta.isStarted && b.meta.isStarted) {
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
