import React from "react";
import { useSelector } from "react-redux";
import copyToClipboard from "copy-text-to-clipboard";
import { selectServerById } from "../services/qws/servers.js";
import { Scoreboard } from "./Scoreboard.jsx";
import { QuakeText } from "./QuakeText.jsx";
import { pluralize } from "../common/text.js";
import { TextBlur } from "../TextAnimations.jsx";
import { PrimaryButton, SpectatorButton } from "../Buttons";

const ServerProgress = React.memo((props) => {
  const { value, max } = props;
  const progress = 100 * (value / max);
  const width = `${progress}%`;

  return (
    <div className="server-progress">
      <div className="server-progress-bar" style={{ width }} />
    </div>
  );
});

const ServerHeader = (props) => {
  const { server } = props;

  return (
    <div className="border-b border-black">
      <div className="flex justify-between p-3">
        <ServerStatus
          mode={server.mode}
          map={server.settings.map}
          statusName={server.status.name}
          statusDescription={server.status.description}
        />
        {server.player_slots.free > 0 && (
          <PrimaryButton href={`qw://${server.address}/`} className="flex items-center px-5 rounded-lg">
            Play
          </PrimaryButton>
        )}
      </div>
      {server.time.total > 0 &&
        ["Started", "Countdown"].includes(server.status.name) && (
          <ServerProgress value={server.time.elapsed} max={server.time.total} />
        )}
    </div>
  );
};

const ServerStatus = React.memo((props) => {
  const { mode, map, statusName, statusDescription } = props;

  return (
    <div>
      <strong className="has-text-white">
        <TextBlur key="mode" value={mode} />
      </strong>{" "}
      on{" "}
      <strong className="has-text-white">
        <TextBlur key="map" value={map} />
      </strong>
      <div className="text-sm">
        <span className="server-status mr-1">
          {["Started", "Countdown"].includes(statusName) && (
            <span className="px-1 py-0.5 rounded font-mono text-xs bg-red-600 app-text-shadow">LIVE</span>
          )}{" "}
          {"Standby" === statusName && (
            <div className="indicator-waiting-container">
              <div className="indicator-waiting" />
            </div>
          )}
        </span>

        <span className="text-gray-300 text-xs">{statusDescription}</span>
      </div>
    </div>
  );
});

const ServerMapshot = (props) => {
  const { server } = props;

  const mapThumbnailSrc = server.settings.map
    ? `url(https://raw.githubusercontent.com/vikpe/qw-mapshots/main/${server.settings.map}.jpg)`
    : "none";

  return (
    <div className="grow bg-cover bg-center bg-[url(/assets/img/default_mapshot.jpg)]">
      <div
        className="h-full min-h-[200px] bg-cover bg-center"
        style={{ backgroundImage: mapThumbnailSrc }}
      >
        <div className="flex flex-col justify-center items-center bg-gray-700/40 h-full px-4 py-2">
          {server.meta.showMatchtag && (
            <div className="px-5 mb-4 uppercase font-bold tracking-widest text-center w-full">
              {server.settings.matchtag}
            </div>
          )}
          <Scoreboard
            server={server}
            limit={server.meta.playerDisplay.visible}
          />

          <HiddenPlayers count={server.meta.playerDisplay.hidden} />
          <SpectatorText text={server.meta.spectatorText} />
        </div>
      </div>
    </div>
  );
};

const HiddenPlayers = React.memo((props) => {
  const { count } = props;

  if (0 === count) {
    return null;
  }

  return (
    <div className="mt-1 text-sm">
      +{count} {pluralize("player", count)}
    </div>
  );
});

const SpectatorText = React.memo((props) => {
  const { text } = props;

  if ("" === text) {
    return null;
  }

  return (
    <div className="text-sm mt-4 text-white/60 app-text-shadow">
      <span className="qw-color-b">specs:</span>{" "}
      <QuakeText tag="span" text={text} />
    </div>
  );
});

const SpectatorButtons = (props) => {
  const { server } = props;

  return (
    <div>
      <div className="flex items-center space-x-4">
        <SpectatorButton
          className="p-1 px-2 w-full rounded-lg"
          href={`qw://${server.address}/observe`}
          count={server.spectator_slots.used}
        >
          Spectate{" "}

        </SpectatorButton>

        {server.qtv_stream.address !== "" && (
          <SpectatorButton
            className="p-1 px-2 w-full rounded-lg"
            href={`qw://${server.qtv_stream.url}/qtvplay`}
            count={server.qtv_stream.spectator_count}
          >
            QTV
          </SpectatorButton>
        )}

        {false &&
          server.streams.map((stream) => (
            <div className="column is-narrow" key={stream.channel}>
              <StreamButton channel={stream.channel} />
            </div>
          ))}
      </div>
    </div>
  );
};

const StreamButton = React.memo((props) => {
  const { channel } = props;
  const url = `https://twitch.tv/${channel}`;

  return (
    <a href={url} className="button is-fullwidth is-small is-dark">
      <img
        src={`/assets/img/icons/twitch_glitch_purple.svg`}
        width="16"
        height="16"
        className="mx-2"
        alt={url}
      />
      {channel}
    </a>
  );
});

const ServerFooter = (props) => {
  const { server } = props;

  return (
    <div className="p-3 border-t border-t-black bg-[#334] text-sm space-y-3">
      <SpectatorButtons server={server} />

      <div className="flex items-center text-xs justify-between">
        <div
          className="server-address cursor-pointer text-white/60"
          onClick={() => copyToClipboard(server.settings.hostname_parsed)}
          title="Copy IP to clipboard"
        >
          <ServerAddressTitle
            cc={server.geo.cc}
            title={server.meta.addressTitle}
          />
          <img
            src="/assets/img/icons/content_paste.svg"
            width="12"
            alt=""
            className="app-icon ml-1 inline"
          />
        </div>

        {server.settings.ktxver && (
          <KtxVersion version={server.settings.ktxver} />
        )}
      </div>
    </div>
  );
};

const ServerAddressTitle = React.memo((props) => {
  const { cc, title } = props;

  return (
    <span className="block float-left max-w-[260px] truncate">
      {cc && (
        <React.Fragment>
          <img
            src={`https://www.quakeworld.nu/images/flags/${cc.toLowerCase()}.gif`}
            width="16"
            height="11"
            alt={cc}
            className="inline mr-1"
          />
        </React.Fragment>
      )}
      {title}
    </span>
  );
});

const KtxVersion = React.memo((props) => {
  const { version } = props;
  const label = `KTX ${version}`;

  return (
    <div className="w-20 overflow-hidden whitespace-nowrap text-ellipsis text-white/40" title={label}>{label}</div>
  );
});

const getModifiers = (server) => {
  const modifiers = ["server-wrapper"];

  if (server.meta.showMatchtag) {
    modifiers.push("smod-matchtag");
  }

  if (server.player_slots.free > 0) {
    modifiers.push("smod-hasfreeplayer_slots");
  } else if (server.meta.isStandBy) {
    modifiers.push("smod-waitingforready");
  }

  return modifiers;
};

export function ServerById({ id }) {
  const server = useSelector((state) => selectServerById(state, id));
  const modifiers = getModifiers(server);
  const wrapperClassNames = modifiers.join(" ");

  return (
    <div className={`w-full flex flex-col ${wrapperClassNames}`}>
      <div className="server flex flex-col h-full bg-[#445]">
        <ServerHeader server={server} />
        <ServerMapshot server={server} />
        <ServerFooter server={server} />
      </div>
    </div>
  );
}
