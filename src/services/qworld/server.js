import { isQwleagueOfficial } from "@qwhub/servers/util.ts";
import { geoByIpOrEmpty } from "./geo";

export const isBot = (client) => Boolean(client.bot);

export const isGameServer = (server) => server.server_type === "game";

// v1 game server => hub server (v1 game server + meta)
export const toServer = (gameServer, geo) => {
  const server = {
    ...gameServer,
    players: gameServer.players.filter(
      (p) => !p.name.ascii.replaceAll(" ", "").includes("h1.nu"),
    ),
    spectators: gameServer.spectators.filter(
      (s) => !isBot(s) && s.name.ascii !== "[ServeMe]",
    ),
  };
  server.meta = toMeta(server, geoByIpOrEmpty(geo, server.ip));
  return server;
};

const toInt = (value) => Number.parseInt(value ?? "0", 10) || 0;

const toMeta = (server, geo) => {
  const { info } = server;
  const mode = server.game_mod ?? server.player_mode ?? gamedirMode(info);
  const statusText = info.status ?? "";
  const status = toStatus(statusText, mode, server);
  const hostport =
    info.hostport || parseHostname(server.address, info.hostname);
  const matchtag = (info.matchtag ?? "").toLowerCase();
  const title = toTitle(mode, info, server.players);

  const showMatchTag =
    matchtag &&
    !matchtag.includes("ezq") &&
    !matchtag.includes("enhanced") &&
    !matchtag.includes("client") &&
    !matchtag.includes("h1.nu") &&
    title.includes(matchtag);

  const isTeamplay = toInt(info.teamplay) > 0;
  const maxPlayerCount = isTeamplay ? 8 : 10;
  const playerCount = server.players.length;
  const visiblePlayerCount = Math.min(maxPlayerCount, playerCount);

  let wrapperClassNames = "server-wrapper";

  if (showMatchTag) {
    wrapperClassNames += " smod-matchtag";

    if (isQwleagueOfficial(info.hostname, matchtag)) {
      wrapperClassNames += " smod-qwleague-official";
    }
  }

  if (playerCount < server.player_limit) {
    wrapperClassNames += " smod-hasfreeplayer_slots";
  }

  // todo: qhlan
  if ((info.hostname ?? "").toLowerCase().includes("qhlan")) {
    wrapperClassNames += " smod-qhlan";
  }

  return {
    mode,
    title,
    status,
    time: toTime(toInt(info.timelimit), statusText),
    geo,
    hostport,
    addressTitle: toAddressTitle(server.address, hostport, info.hostname),
    spectatorText: toSpectatorText(server),
    matchtag: showMatchTag ? info.matchtag : "",
    playerDisplay: {
      visible: visiblePlayerCount,
      hidden: playerCount - visiblePlayerCount,
    },
    wrapperClassNames,
    supportsLastscores: supportsLastscores(info["*version"]),
  };
};

const stripNonAscii = (str) => str.replace(/[^ -~]+/g, "");

const toAddressTitle = (address, hostport, hostname) => {
  if (undefined === hostname) {
    return address;
  }

  if (hostport !== address) {
    return hostport;
  }

  return stripNonAscii(hostname)
    .trim()
    .replace(/ \(.+ vs. .+\)$/gm, "")
    .trim();
};

const toSpectatorText = (server) => {
  const maxLength = 88;
  const more = "..";
  const qtvClientNames = server.qtv_stream?.client_names ?? [];
  const names = server.spectators
    .map((s) => s.name.ascii)
    .concat(qtvClientNames.map((n) => n.ascii))
    .filter((n) => !n.includes("h1.nu"));

  const text = names.join(", ");

  if (text.length > maxLength) {
    return text.slice(0, maxLength - more.length) + more;
  }

  return text;
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
  } catch {
    return false;
  }
};

// mod name for servers the api can't classify, e.g. "mtfcoop2"
const gamedirMode = (info) => {
  const gamedir = (info["*gamedir"] ?? info.gamedir ?? "").toLowerCase();
  return ["", "qw", "id1", "ktx"].includes(gamedir) ? "" : gamedir;
};

// mode helpers
const isXonX = (mode) => /^\d+on\d+$/.test(mode);
const isFfa = (mode) => mode === "ffa";

const toStatus = (status, mode, server) => {
  if (mode === "race") {
    return { name: "Standby", description: "Racing" };
  }

  const { players } = server;
  const hasFrags = players.some((p) => p.frags > 0);

  if ("Standby" === status && (isXonX(mode) || isFfa(mode)) && hasFrags) {
    if (players.some(isBot)) {
      return players.some((p) => !isBot(p))
        ? { name: "Standby", description: "Score screen" }
        : { name: "Standby", description: "Waiting for players" };
    }
    return { name: "Started", description: "Score screen" };
  }

  if ("Standby" === status) {
    const freeSlots = server.player_limit - players.length;
    const description =
      freeSlots > 0 && isXonX(mode)
        ? `Waiting for ${freeSlots} ${freeSlots === 1 ? "player" : "players"}`
        : "Waiting for players to ready up";
    return { name: "Standby", description };
  }

  if ("Countdown" === status || status.includes(" min left")) {
    const description = ["coop", "ca"].includes(mode)
      ? "Game in progress"
      : status;
    return { name: "Started", description };
  }

  // non-ktx servers have no status
  if ("" === status) {
    const description = players.length > 0 ? "Playing" : "Waiting for players";
    return { name: "Unknown", description };
  }

  return { name: "Unknown", description: status };
};

const toTime = (timelimit, status) => {
  const minLeftNeedle = " min left";
  const remaining = status.includes(minLeftNeedle)
    ? toInt(status.replace(minLeftNeedle, ""))
    : timelimit;

  return { total: timelimit, elapsed: timelimit - remaining, remaining };
};

const toTitle = (mode, info, players) => {
  const map = info.map ? ` [${info.map}]` : "";
  const matchtag = parseMatchtag(info.matchtag ?? "");
  const prefix = [matchtag, mode].filter(Boolean).join(" / ");

  if (0 === players.length || isFfa(mode)) {
    return `${prefix}${map}`;
  }

  const byName = (a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1);
  const playerNames = players.map((p) => p.name.ascii);
  const teamNames = new Set(players.map((p) => p.team.ascii));
  const isTeamplay = toInt(info.teamplay) > 0;
  let participants;
  let delimiter;

  if (isTeamplay && mode !== "1on1" && mode !== "coop" && teamNames.size <= 2) {
    participants = [...teamNames].map((teamName) => {
      const names = players
        .filter((p) => p.team.ascii === teamName)
        .map((p) => p.name.ascii);

      if (names.length > 4) {
        return teamName;
      }

      const nameList = names.sort(byName).join(", ");
      return teamName ? `${teamName} (${nameList})` : nameList;
    });
    delimiter = " vs ";
  } else {
    participants = playerNames;
    delimiter = mode === "1on1" ? " vs " : ", ";
  }

  participants = participants.filter((p) => p.trim() !== "");

  if (0 === participants.length) {
    return `${prefix}${map}`;
  }

  const participantList = participants.sort(byName).join(delimiter);
  return prefix
    ? `${prefix}: ${participantList}${map}`
    : `${participantList}${map}`;
};

const parseMatchtag = (matchtag) => {
  const result = matchtag
    .replace(/[^\p{L}\p{N} -]+/gu, " ")
    .replace(/[ -]{2,}/g, (m) => m[0])
    .replace(/^[ -]+|[ -]+$/g, "");

  if (result.length < 3) {
    return "";
  }

  if (["pause", "pausable", "test"].some((n) => result.includes(n))) {
    return "";
  }

  const ignored = [
    "duel",
    "1on1",
    "2on2",
    "3on3",
    "4on4",
    "ffa",
    "ctf",
    "race",
  ];
  return ignored.includes(result) ? "" : result;
};

const hostnamePattern =
  /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;

// "qw.foppa.dk:28501 #1" => "qw.foppa.dk:28501", fallback to address
export const parseHostname = (address, hostname = "") => {
  if (!hostname.includes(".")) {
    return address;
  }

  let candidate = hostname.toLowerCase().split(" ")[0].trim();

  if (candidate.length < 4 || !candidate.includes(".")) {
    return address;
  }

  if (candidate.includes(":")) {
    const colonIndex = candidate.indexOf(":");
    const suffixLength = ":28501".length;

    if (candidate.length < colonIndex + suffixLength) {
      return address;
    }

    candidate = candidate.substring(0, colonIndex + suffixLength);
    const [host, port] = candidate.split(":");
    return hostnamePattern.test(host) && /^\d+$/.test(port)
      ? candidate
      : address;
  }

  if (hostnamePattern.test(candidate)) {
    const port = address.split(":")[1];
    return `${candidate}:${port}`;
  }

  return address;
};
