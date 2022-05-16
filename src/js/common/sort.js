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
  if (a.Players.length > b.Players.length) {
    return -1;
  } else if (a.Players.length < b.Players.length) {
    return 1;
  }

  // spectator count
  if (a.SpectatorNames.length > b.SpectatorNames.length) {
    return -1;
  } else if (a.SpectatorNames.length < b.SpectatorNames.length) {
    return 1;
  }

  // is started
  if (a.Status === "Started" && !b.Status === "Started") {
    return -1;
  } else if (!a.Status === "Started" && b.Status === "Started") {
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
