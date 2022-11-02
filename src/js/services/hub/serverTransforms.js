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
  let spectator_names = server.spectator_names.concat(
    server.qtv_stream.spectator_names
  );

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
  const isStarted = "Started" === server.status.name;

  const showTeamColumn = "teamplay" in server.settings && server.settings.teamplay > 0;
  const showTeams = showTeamColumn && (server.teams.length < server.player_slots.used) && server.teams.length <= 3;

  const showMatchTag = "matchtag" in server.settings &&
    !server.settings.matchtag.includes("prac") &&
    server.title.includes(server.settings.matchtag);

  const meta = {
    isStarted,
    isStandBy: !isStarted,
    addressTitle,
    spectatorText,
    mapName: server.settings["map"],
    matchtag: showMatchTag ? server.settings.matchtag : "",
    showTeams,
    showTeamColumn,
  };

  let maxPlayerCount = 8;
  const isTeamplay = "teamplay" in server.settings && server.settings.teamplay > 0;

  if (!isTeamplay) {
    maxPlayerCount += 2;
  }

  meta.playerDisplay = calcPlayerDisplay(server.player_slots.used, maxPlayerCount);

  // wrapper class names
  meta.wrapperClassNames = "server-wrapper";

  if (showMatchTag) {
    meta.wrapperClassNames += " smod-matchtag";
  }

  if (server.player_slots.free > 0) {
    meta.wrapperClassNames += " smod-hasfreeplayer_slots";
  }

  return meta;
};

const stripNonAscii = (str) => str.replace(/[^ -~]+/g, "");

const calcSpectatorText = (spectators) => {
  const maxLength = 88;
  const separator = ", ";
  const more = "..";

  let text = spectators.join(separator);

  if (text.length > maxLength) {
    text = text.slice(0, maxLength - more.length) + more;
  }

  return text;
};

const calcPlayerDisplay = (playerCount, maxPlayers) => {
  const visible = Math.min(maxPlayers, playerCount);
  const hidden = playerCount - visible;
  return { visible, hidden, };
};

