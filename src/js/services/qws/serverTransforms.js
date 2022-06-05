import { pluralize, stripNonAscii } from "./../../util/text";

export const metaByServer = (server) => {
  let clientNames = server.Players.map((p) => p.Name) + server.SpectatorNames;
  let spectatorNames = server.SpectatorNames.concat(
    server.QtvStream.SpectatorNames
  );
  let keywords = [server.Mode, server.Settings.map]
    .concat(clientNames)
    .concat(spectatorNames);

  keywords = keywords
    .filter((p) => p !== "")
    .join(" ")
    .toLowerCase();

  let addressTitle;

  if ("hostname" in server.Settings) {
    addressTitle = stripNonAscii(server.Settings.hostname)
      .trim()
      .replace(/ \(.+ vs. .+\)$/gm, "")
      .trim();
  } else {
    addressTitle = server.Address;
  }

  const spectatorText = calcSpectatorText(spectatorNames);

  const isStarted = "Started" === server.Status;
  const meta = {
    isStarted,
    isStandBy: !isStarted,
    addressTitle,
    keywords,
    spectatorText,
    spectatorCount: spectatorNames.length,
    score:
      //10 * server.streams.length +
      2 * spectatorNames.length + server.Players.length,
    statusText: statusTextByServer(server),
  };

  const maxRowCount = 8;
  meta.playerDisplay = calcPlayerDisplay(server, maxRowCount);

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

const calcPlayerDisplay = (server, maxRows) => {
  const showAsTwoColumns = "1on1" === server.Mode || 2 === server.Teams.length;

  const miscRowCount =
    Number("matchtag" in server.Settings) + Number(showAsTwoColumns);
  const maxPlayerRows = Math.max(0, maxRows - miscRowCount);

  const playersPerRow = showAsTwoColumns ? 2 : 1;
  const totalPlayerRows = Math.ceil(server.PlayerSlots.Used / playersPerRow);
  const visiblePlayerRows = Math.min(maxPlayerRows, totalPlayerRows);

  const visiblePlayers = Math.min(
    server.PlayerSlots.Used,
    visiblePlayerRows * playersPerRow
  );
  const hiddenPlayers = server.PlayerSlots.Used - visiblePlayers;

  return {
    visible: visiblePlayers,
    hidden: hiddenPlayers,
  };
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
      `${server.PlayerSlots.Used} of ${server.PlayerSlots.Total} players`
    );

    if (isFfa) {
      status.push(gameTimeProgress(server.Time.Remaining));
    }
  } else {
    if ("Standby" === server.Status) {
      if (server.PlayerSlots.Free > 0) {
        status.push(
          `Waiting for ${server.PlayerSlots.Free} ${pluralize(
            "player",
            server.PlayerSlots.Free
          )}`
        );
      } else {
        status.push("Waiting for players to ready up");
      }
    } else {
      status.push(gameTimeProgress(server.Time.Remaining));
    }
  }

  return status.filter((p) => p).join(", ");
};
