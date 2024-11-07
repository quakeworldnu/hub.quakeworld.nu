function fixAddress(address) {
  return address.replaceAll("213.76.101.30", "play.qwlan.pl");
}

export const transformServer = (server) => {
  // radomsko lan fix
  server.address = fixAddress(server.address);
  server.settings.hostname = fixAddress(server.settings.hostname);
  server.settings.hostname_parsed = fixAddress(server.settings.hostname_parsed);
  server.qtv_stream.address = fixAddress(server.qtv_stream.address);
  server.qtv_stream.url = fixAddress(server.qtv_stream.url);

  // exclude [ServeMe]
  const index = server.spectator_names.indexOf("[ServeMe]");

  if (index !== -1) {
    server.spectator_names.splice(index, 1);
    server.spectator_slots.used--;
  }

  // add meta data
  server.meta = metaByServer(server);

  return server;
};

const metaByServer = (server) => {
  const spectator_names = server.spectator_names.concat(
    server.qtv_stream.spectator_names,
  );

  let addressTitle;

  if ("hostname" in server.settings) {
    if (
      "hostname_parsed" in server.settings &&
      server.settings.hostname_parsed !== server.address
    ) {
      addressTitle = server.settings.hostname_parsed;
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

  const showMatchTag =
    "matchtag" in server.settings &&
    !server.settings.matchtag.includes("prac") &&
    server.title.includes(server.settings.matchtag);

  const meta = {
    isStarted,
    isStandBy: !isStarted,
    addressTitle,
    spectatorText,
    mapName: server.settings.map,
    matchtag: showMatchTag ? server.settings.matchtag : "",
    supportsLastscores: supportsLastscores(server.settings["*version"]),
  };

  let maxPlayerCount = 8;
  const isTeamplay =
    "teamplay" in server.settings && server.settings.teamplay > 0;

  if (!isTeamplay) {
    maxPlayerCount += 2;
  }

  meta.playerDisplay = calcPlayerDisplay(
    server.player_slots.used,
    maxPlayerCount,
  );

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
  return { visible, hidden };
};

const supportsLastscores = (version) => {
  try {
    if (!version.includes("MVDSV")) {
      return false;
    }
    const parts = version.substring(0, "MVDSV 0.xx".length).split(" ");
    const releaseNumber = Number.parseFloat(parts[1]);
    const MIN_SUPPORTED_VERSION = 0.36;
    return releaseNumber >= MIN_SUPPORTED_VERSION;
  } catch (e) {
    return false;
  }
};
