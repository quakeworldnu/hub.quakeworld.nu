import { regionNameByCountryCode } from "./regions";
import { quakeTextToPlainText, stripNonAscii } from "./text";

export const serverAddressTitleByServer = (server) => {
  const hasDistinctHostname = !server.Address.includes(server.IpAddress);

  let title;

  if (hasDistinctHostname) {
    title = server.Address;
  } else {
    title = server.Title.replace(/ \(\w+ vs\. \w+\)/, "");
  }

  return stripNonAscii(title).trim();
};

export const metaByServer = (server) => {
  const clientCount = server.Players.length;
  const hasClients = clientCount > 0;
  const spectatorCount = server.Players.filter((p) => p.Spec).length;
  const hasSpectators = spectatorCount > 0;
  const playerCount = clientCount - spectatorCount;
  const hasPlayers = playerCount > 0;
  const totalPlayerSlots = server.MaxClients;
  const freePlayerSlots = totalPlayerSlots - playerCount;
  const hasFreePlayerSlots = freePlayerSlots > 0;
  const descriptionParts = server.Description.split(", ");

  let modeName = descriptionParts[0];
  const isXonX = /\d+v\d+/gi.test(modeName);

  if (isXonX) {
    modeName = modeName.replace("v", "on");
  }

  const isDuel = "1on1" === modeName;
  const isTeamplay = !isDuel && isXonX;
  const isRace = "Racing" === server.Description;
  const isFfa = "FFA" === modeName;
  const isFortress =
    server.Settings.gametype && server.Settings.gametype === "fortressone";
  const isCustom = !(isDuel || isTeamplay || isRace || isFfa || isFortress);

  if (isFortress) {
    modeName = "Fortress";
  }

  const isStarted = server.Description.indexOf("min left") !== -1;
  const isStandby = !isStarted;
  const isWaitingForPlayersToReadyUp = isStandby && !hasFreePlayerSlots;

  let minutesRemaining = 0;
  let minutesTotal = 0;
  let minutesElapsed = 0;

  if (isStarted) {
    minutesRemaining = parseInt(descriptionParts[1].replace("min left", ""));
  }

  if (server.Settings.timelimit) {
    minutesTotal = server.Settings.timelimit;
    minutesElapsed = minutesTotal - minutesRemaining;
  }

  const displayProgress = isStarted && minutesRemaining > 0;

  let rawClientNames = server.Players.map((p) => p.Name);

  const hasQtv = server.QTV.length > 0 && server.QTV[0].Address !== "";
  const qtvSpectatorCount = hasQtv ? server.QTV[0].Specs : 0;
  const hasQtvSpectators = qtvSpectatorCount > 0;

  if (hasQtvSpectators) {
    rawClientNames = rawClientNames.concat(server.QTV[0].SpecList);
  }

  const plainTextClientNames = rawClientNames.map((n) =>
    quakeTextToPlainText(n)
  );

  let keywords = [modeName, server.Map].concat(plainTextClientNames);

  keywords = keywords
    .filter((p) => p !== "")
    .join(" ")
    .toLowerCase();

  const matchtag = server.Settings.matchtag || "";
  const hasMatchtag = matchtag !== "";

  const regionName = regionNameByCountryCode(server.Country);

  const teams = isTeamplay
    ? teamsByPlayers(server.Players.filter((p) => !p.Spec))
    : [];
  const hasTeams = teams.length > 0;

  const showAsTwoColumns = isDuel || 2 === teams.length;

  const addressTitle = serverAddressTitleByServer(server);

  const meta = {
    isStandby,
    isStarted,
    isWaitingForPlayersToReadyUp,
    regionName,
    addressTitle,
    teams,
    hasTeams,
    displayProgress,
    minutesTotal,
    minutesElapsed,
    minutesRemaining,
    matchtag,
    hasMatchtag,
    keywords,
    showAsTwoColumns,
    mode: {
      name: modeName,
      isDuel,
      isTeamplay,
      isXonX,
      isFfa,
      isRace,
      isFortress,
      isCustom,
    },
    clientCount,
    hasClients,
    spectatorCount,
    hasSpectators,
    playerCount,
    hasPlayers,
    totalPlayerSlots,
    freePlayerSlots,
    hasFreePlayerSlots,
    hasQtv,
    hasQtvSpectators,
    qtvSpectatorCount,
  };

  meta.statusText = statusTextByMeta(meta);

  const maxRowCount = 6;
  meta.rows = calcServerRows(meta, maxRowCount);

  return meta;
};

const teamsByPlayers = (players) => {
  const teamsObj = {};

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const teamName = player.Team;

    if (!teamsObj.hasOwnProperty(teamName)) {
      teamsObj[teamName] = {
        Name: teamName,
        PlayerCount: 0,
        Players: [],
        Frags: 0,
        Colors: [0, 0],
      };
    }

    const playerTeam = teamsObj[teamName];
    playerTeam.PlayerCount += 1;
    playerTeam.Players.push(player);
    playerTeam.Frags += player.Frags;
  }

  const teams = Object.values(teamsObj);

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    team.Colors = majorityColors(team.Players);
  }

  teams.sort(sortByProp("Frags", "DESC"));

  return teams;
};

const majorityColors = (players) => {
  const colorCount = {};
  const separator = "-";
  let color;

  for (let i = 0; i < players.length; i++) {
    color = players[i].Colors.join(separator);

    if (!colorCount.hasOwnProperty(color)) {
      colorCount[color] = 0;
    }

    colorCount[color] += 1;
  }

  const sortedColorCount = Object.keys(colorCount).sort(
    (a, b) => colorCount[b] - colorCount[a]
  );

  return sortedColorCount[0].split(separator);
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

const gameTimeProgress = (minutesRemaining) => {
  if (minutesRemaining) {
    return `${minutesRemaining} min left`;
  } else {
    return "";
  }
};

export const statusTextByMeta = (meta) => {
  const status = [];

  if (meta.mode.isFfa || meta.mode.isRace) {
    status.push(`${meta.playerCount} of ${meta.totalPlayerSlots} players`);

    if (meta.mode.isFfa) {
      status.push(gameTimeProgress(meta.minutesRemaining));
    }
  } else {
    if (meta.isStandby) {
      if (meta.hasFreePlayerSlots) {
        status.push(`Waiting for ${meta.freePlayerSlots} player(s)`);
      } else {
        status.push("Waiting for players to ready up");
      }
    } else {
      status.push(gameTimeProgress(meta.minutesRemaining));
    }
  }

  return status.filter((p) => p).join(", ");
};

const filterByQuery = (servers, query) => {
  const minQueryLength = 2;

  if (query.length < minQueryLength) {
    return servers;
  }

  const queryWords = query.toLowerCase().split(" ");
  const keywordFilterFunc = (server) => {
    return queryWords.every((word) => {
      return server.meta.keywords.indexOf(word) !== -1;
    });
  };
  return servers.filter(keywordFilterFunc);
};

export const filterServers = (servers, filters, favoriteServers) => {
  let result = filterByQuery(servers, filters.query);

  if (filters.isFavorite) {
    result = result.filter((s) => favoriteServers.includes(s.Address));
  }

  if (filters.isStarted) {
    result = result.filter((s) => s.meta.isStarted);
  }

  if (filters.regionName) {
    result = result.filter((s) => s.meta.regionName === filters.regionName);
  }

  return result;
};

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

export const isBot = (p) =>
  p.IsBot || p.Name.toLowerCase().includes("[serveme]");

const calcRows = (itemsPerRow, itemCount, maxRowCount) => {
  const total = Math.ceil(itemCount / itemsPerRow);
  const display = Math.min(maxRowCount, total);
  const hide = total - display;

  return {
    total,
    display,
    hide,
  };
};

const calcPlayerRows = (serverMeta, maxRowCount) => {
  const playersPerRow = serverMeta.showAsTwoColumns ? 2 : 1;
  return calcRows(playersPerRow, serverMeta.playerCount, maxRowCount);
};

const calcSpectatorRows = (serverMeta, maxRows) => {
  const spectatorsPerRow = 2;
  return calcRows(spectatorsPerRow, serverMeta.spectatorCount, maxRows);
};

const calcServerRows = (meta, maxRows) => {
  const miscRows = meta.hasMatchtag + meta.showAsTwoColumns;

  const playerMaxRows = Math.max(0, maxRows - miscRows);
  const playerRows = calcPlayerRows(meta, playerMaxRows);

  const spectatorMaxRows = Math.max(0, playerMaxRows - playerRows.display);
  const spectatorRows = calcSpectatorRows(meta, spectatorMaxRows);

  return {
    maxRows,
    miscRows,
    playerMaxRows,
    playerRows,
    spectatorMaxRows,
    spectatorRows,
  };
};
