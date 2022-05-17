export const compareServers = (a, b) => {
  // -1 = a
  // 1 = b
  // 0 = unchanged

  // tag
  if ("matchtag" in a.Settings && !"matchtag" in b.Settings) {
    return -1;
  } else if (!"matchtag" in a.Settings && "matchtag" in b.Settings) {
    return 1;
  }

  // player count
  if (a.PlayerSlots.Used > b.PlayerSlots.Used) {
    return -1;
  } else if (a.PlayerSlots.Used < b.PlayerSlots.Used) {
    return 1;
  }

  // spectator count
  if (a.SpectatorSlots.Used > b.SpectatorSlots.Used) {
    return -1;
  } else if (a.SpectatorSlots.Used < b.SpectatorSlots.Used) {
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
