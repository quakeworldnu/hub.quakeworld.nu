export const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

export const shuffleArray = (array) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const metaByServer = (server) => {
  const clientCount = server.Players.length;
  const spectatorCount = server.Players.filter((p) => p.Spec).length;
  const hasSpectators = spectatorCount > 0;
  const playerCount = clientCount - spectatorCount;
  const hasPlayers = playerCount > 0;
  const freePlayerSlots = server.MaxClients - playerCount;
  const hasFreePlayerSlots = freePlayerSlots > 0;

  let modeName = server.Description.split(", ")[0];
  const isDuel = "1v1" === modeName;
  const isTeamplay = !isDuel && /\d+v\d+/gi.test(modeName);
  const isRace = "Racing" === server.Description;
  const isFfa = "FFA" === modeName;
  const isFortress = server.gametype && server.gametype === "fortressone";
  const isCustom = !(isDuel || isTeamplay || isRace || isFfa || isFortress);

  const isStarted = server.Description.indexOf("min left") !== -1;
  const isStandby = !isStarted;

  if (isFortress) {
    modeName = "Fortress";
  }

  return {
    isStandby,
    isStarted,
    mode: {
      name: modeName,
      isDuel,
      isTeamplay,
      isFfa,
      isRace,
      isFortress,
      isCustom,
    },
    clientCount,
    spectatorCount,
    hasSpectators,
    playerCount,
    hasPlayers,
    freePlayerSlots,
    hasFreePlayerSlots,
  };
};
