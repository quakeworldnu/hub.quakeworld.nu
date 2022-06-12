import { pluralize } from "../../common/text";

export const transformResponseData = (data) => {
  const servers = data;

  // ignore [ServeMe]
  for (let i = 0; i < servers.length; i++) {
    const index = servers[i].spectator_names.indexOf("[ServeMe]");

    if (index !== -1) {
      servers[i].spectator_names.splice(index, 1);
      servers[i].spectator_slots.used--;
    }
  }

  // add meta data
  for (let i = 0; i < servers.length; i++) {
    servers[i].meta = metaByServer(servers[i]);
  }

  return servers;
};

const metaByServer = (server) => {
  let clientNames = server.players.map((p) => p.name) + server.spectator_names;
  let spectator_names = server.spectator_names.concat(
    server.qtv_stream.spectator_names
  );
  let keywords = [server.mode, server.settings.map]
    .concat(clientNames)
    .concat(spectator_names);

  keywords = keywords
    .filter((p) => p !== "")
    .join(" ")
    .toLowerCase();

  let addressTitle;

  if ("hostname" in server.settings) {
    if (
      "hostname_parsed" in server.settings &&
      server.settings["hostname_parsed"] !== server.address
    ) {
      addressTitle = server.settings["hostname_parsed"];
    } else {
      addressTitle = stripNonAscii(server.settings.hostname)
        .trim()
        .replace(/ \(.+ vs. .+\)$/gm, "")
        .trim();
    }
  } else {
    addressTitle = server.address;
  }

  const spectatorText = calcSpectatorText(spectator_names);

  const isStarted = "Started" === server.status;
  const score =
    "ffa" === server.mode
      ? server.players.length
      : 2 * server.players.length + 6 * spectator_names.length;

  const meta = {
    isStarted,
    isStandBy: !isStarted,
    addressTitle,
    keywords,
    spectatorText,
    spectator_count: spectator_names.length,
    score,
    statusText: statusTextByServer(server),
  };

  const maxRowCount = 8;
  meta.playerDisplay = calcPlayerDisplay(server, maxRowCount);

  return meta;
};

const stripNonAscii = (str) => str.replace(/[^ -~]+/g, "");

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
  const showAsTwoColumns = "1on1" === server.mode || 2 === server.teams.length;

  const miscRowCount =
    Number("matchtag" in server.settings) + Number(showAsTwoColumns);
  const maxPlayerRows = Math.max(0, maxRows - miscRowCount);

  const playersPerRow = showAsTwoColumns ? 2 : 1;
  const totalPlayerRows = Math.ceil(server.player_slots.used / playersPerRow);
  const visiblePlayerRows = Math.min(maxPlayerRows, totalPlayerRows);

  const visiblePlayers = Math.min(
    server.player_slots.used,
    visiblePlayerRows * playersPerRow
  );
  const hiddenPlayers = server.player_slots.used - visiblePlayers;

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

  let isFfa = "ffa" === server.mode;
  let isRace = "race" === server.mode;

  if (isFfa || isRace) {
    status.push(
      `${server.player_slots.used} of ${server.player_slots.total} players`
    );

    if (isFfa) {
      status.push(gameTimeProgress(server.time.remaining));
    }
  } else {
    if ("Standby" === server.status) {
      if (server.player_slots.free > 0) {
        status.push(
          `Waiting for ${server.player_slots.free} ${pluralize(
            "player",
            server.player_slots.free
          )}`
        );
      } else {
        status.push("Waiting for players to ready up");
      }
    } else {
      status.push(gameTimeProgress(server.time.remaining));
    }
  }

  return status.filter((p) => p).join(", ");
};
