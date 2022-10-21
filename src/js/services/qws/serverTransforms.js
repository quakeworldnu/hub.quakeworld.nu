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

  const meta = {
    isStarted,
    isStandBy: !isStarted,
    addressTitle,
    spectatorText,
    spectator_count: spectator_names.length,
    showMatchtag:
      "matchtag" in server.settings &&
      !server.settings.matchtag.includes("prac") &&
      server.title.includes(server.settings.matchtag),
  };

  const maxRowCount = 8;
  meta.playerDisplay = calcPlayerDisplay(server, maxRowCount);

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

const calcPlayerDisplay = (server, maxRows) => {
  const miscRowCount = Number("matchtag" in server.settings);
  const maxPlayerRows = Math.max(0, maxRows - miscRowCount);

  const totalPlayerRows = Math.ceil(server.player_slots.used);
  const visiblePlayerRows = Math.min(maxPlayerRows, totalPlayerRows);

  const visiblePlayers = Math.min(server.player_slots.used, visiblePlayerRows);
  const hiddenPlayers = server.player_slots.used - visiblePlayers;

  return {
    visible: visiblePlayers,
    hidden: hiddenPlayers,
  };
};
