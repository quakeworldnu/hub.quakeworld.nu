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
  const totalPlayerSlots = server.MaxClients;
  const freePlayerSlots = totalPlayerSlots - playerCount;
  const hasFreePlayerSlots = freePlayerSlots > 0;

  const descriptionParts = server.Description.split(", ");

  let modeName = descriptionParts[0];
  const isDuel = "1v1" === modeName;
  const isXonX = /\d+v\d+/gi.test(modeName);
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

  let minutesLeft = "";

  if (isStarted) {
    minutesLeft = descriptionParts[1];
  }

  const keywords = [modeName, server.Map, `c:${server.Country}`]
    .concat(server.Players.filter((p) => !p.IsBot).map((p) => p.Name))
    .filter((p) => p !== "")
    .join(" ")
    .toLowerCase();

  const matchtag = server.Settings.matchtag || "";
  const hasMatchtag = matchtag !== "";

  const hasQtv = server.QTV.length > 0 && server.QTV[0].Address !== "";
  const qtvAddress = hasQtv ? server.QTV[0].Address : "";
  const qtvClientCount = hasQtv ? server.QTV[0].Specs : 0;

  const meta = {
    isStandby,
    isStarted,
    minutesLeft,
    matchtag,
    hasMatchtag,
    keywords,
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
    spectatorCount,
    hasSpectators,
    playerCount,
    hasPlayers,
    totalPlayerSlots,
    freePlayerSlots,
    hasFreePlayerSlots,
    hasQtv,
    qtv: {
      address: qtvAddress,
      clientCount: qtvClientCount,
    },
  };

  meta.statusText = statusTextByMeta(meta);

  return meta;
};

export const statusTextByMeta = (meta) => {
  const status = [];

  if (meta.mode.isFfa || meta.mode.isRace || meta.mode.isCustom) {
    status.push(meta.minutesLeft);
    status.push(`${meta.playerCount} of ${meta.totalPlayerSlots} players`);
  } else {
    if (meta.isStandby) {
      if (meta.hasFreePlayerSlots) {
        status.push(`Waiting for ${meta.freePlayerSlots} player(s)`);
      } else {
        status.push("Waiting for players to ready up");
      }
    } else {
      status.push(meta.minutesLeft);
    }
  }

  return status.filter((p) => p).join(", ");
};

const quakeCharToPlainChar = (char) => {
  let charCode = char.charCodeAt(0);

  if (charCode >= 128) {
    charCode -= 128;
  }

  if (charCode < 16 || (charCode >= 29 && charCode <= 31)) {
    return "_";
  } else if (charCode === 16) {
    return "[";
  } else if (charCode === 17) {
    return "]";
  } else if (charCode >= 18 && charCode <= 27) {
    return String.fromCharCode(charCode - 18 + 48);
  } else if (charCode === 28) {
    return "•";
  } else if (charCode >= "A" && charCode <= "Z") {
    return String.fromCharCode(charCode + ("a" - "A"));
  } else {
    return String.fromCharCode(charCode);
  }
};

export const quakeTextToPlainText = (input) =>
  input
    .split("")
    .map((c) => quakeCharToPlainChar(c))
    .join("");

export const quakeTextToHtml = (input, maxLength) => {
  let str = "";
  let currentType = "normal";

  let changeType = function (newType) {
    if (currentType !== newType) {
      if (currentType !== "normal") {
        str += "</span>";
      }
      if (newType !== "normal") {
        str += '<span class="app-text-' + newType + '">';
      }
      currentType = newType;
    }
  };

  for (let i = 0; i < input.length; ++i) {
    if (maxLength >= 0 && i >= maxLength) {
      break;
    }

    let charCode = input.charCodeAt(i);

    if (charCode >= 128) {
      charCode -= 128;
    }

    if (charCode < 16 || (charCode >= 29 && charCode <= 31)) {
      changeType("normal");
      str += "_";
    } else if (charCode === 16) {
      changeType("gold");
      str += "[";
    } else if (charCode === 17) {
      changeType("gold");
      str += "]";
    } else if (charCode >= 18 && charCode <= 27) {
      let num = charCode - 18 + 48;
      changeType("gold");
      str += String.fromCharCode(num);
    } else if (charCode === 28) {
      changeType("normal");
      str += "&#8226;";
    } else {
      if (input.charCodeAt(i) >= 128 + 32) {
        changeType("brown");
      } else {
        changeType("normal");
      }

      if (charCode === "<") {
        str += "&lt;";
      } else if (charCode === ">") {
        str += "&gt;";
      } else if (charCode === '"') {
        str += "&quot;";
      } else {
        str += String.fromCharCode(charCode);
      }
    }
  }
  changeType("normal");

  return str;
};
