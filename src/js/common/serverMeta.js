import { stripNonAscii } from "./text";
import { calcPlayerDisplay } from "./playerDisplay";

export const metaByServer = (server) => {
  let clientNames = server.Players.map((p) => p.Name) + server.SpectatorNames;

  if (server.QtvStream !== "") {
    clientNames += server.QtvStream.SpectatorNames
  }

  let keywords = [server.Mode, server.Map].concat(clientNames);

  keywords = keywords
    .filter((p) => p !== "")
    .join(" ")
    .toLowerCase();

  const showAsTwoColumns = "1on1" === server.Mode || 2 === server.Teams.length;
  const addressTitle = stripNonAscii(server.Address).trim();
  const spectatorText = calcSpectatorText(server.SpectatorNames);

  const meta = {
    addressTitle,
    keywords,
    showAsTwoColumns,
    spectatorText,
  };

  meta.statusText = statusTextByServer(server);

  const maxRowCount = 10;
  meta.playerDisplay = calcPlayerDisplay(meta, server, maxRowCount);

  return meta;
};

const calcSpectatorText = (spectators) => {
  const maxLength = 44;
  const separator = ", ";
  const more = "..";

  let text = spectators.join(separator);

  if (text.length > maxLength) {
    text = text.slice(0, maxLength - more.length) + more;
  }

  return text;
};

const gameTimeProgress = (minutesRemaining) => {
  if (minutesRemaining) {
    return `${minutesRemaining} min left`;
  } else {
    return "";
  }
};

const statusTextByServer = (server) => {
  const status = [];

  let isFfa = "ffa" === server.Mode;
  let isRace = "race" === server.Mode;

  if (isFfa || isRace) {
    status.push(
      `${server.PlayerSlots.Used} of ${server.PlayerSlots.Total} players`);

    if (isFfa) {
      status.push(gameTimeProgress(server.Time.Remaining));
    }
  } else {
    if ("Standby" === server.Status) {
      if (server.PlayerSlots.Free > 0) {
        status.push(`Waiting for ${server.PlayerSlots.Free} player(s)`);
      } else {
        status.push("Waiting for players to ready up");
      }
    } else {
      status.push(gameTimeProgress(server.Time.Remaining));
    }
  }

  return status.filter((p) => p).join(", ");
};
