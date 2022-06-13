import React from "react";
import FavoriteToggle from "./FavoriteToggle.jsx";
import { Scoreboard } from "./Scoreboard.jsx";
import { QuakeText } from "./QuakeText.jsx";
import copyToClipboard from "copy-text-to-clipboard";
import { pluralize } from "../common/text.js";
import { TextBlur } from "../TextAnimations.jsx";
import { useSelector } from "react-redux";
import { selectServerById } from "../services/qws/servers.js";

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
    <div className="server-header">
      <div className="is-flex is-justify-content-space-between p-3">
        <ServerStatus
          mode={server.mode}
          map={server.settings.map}
          statusName={server.status.name}
          statusDescription={server.status.description}
        />
        {server.player_slots.free > 0 && (
          <a href={`qw://${server.address}/`} className="button is-primary">
            Play
          </a>
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
      <div className="app-text-small">
        <span className="server-status mr-1">
          {["Started", "Countdown"].includes(statusName) && (
            <span className="tag is-danger">LIVE</span>
          )}{" "}
          {"Standby" === statusName && (
            <div className="indicator-waiting-container">
              <div className="indicator-waiting" />
            </div>
          )}
        </span>

        <span>{statusDescription}</span>
      </div>
    </div>
  );
});

const ServerMapshot = (props) => {
  const { server } = props;

  const mapThumbnailSrc = server.settings.map
    ? `url(https://vikpe.org/qw-mapshots/${server.settings.map}.jpg)`
    : "none";

  return (
    <div className="server-mapshot-wrapper">
      <div
        className="server-mapshot"
        style={{ backgroundImage: mapThumbnailSrc }}
      >
        <div className="server-mapshot-dimmer">
          {server.meta.showMatchtag && (
            <div className="server-matchtag mb-4">
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
    <div className="mt-1 app-text-small">
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
    <div className="spectator-text app-text-small mt-4">
      <span className="server-spectator-prefix">specs:</span>{" "}
      <QuakeText tag="span" text={text} />
    </div>
  );
});

const SpectatorButtons = (props) => {
  const { server } = props;

  return (
    <div>
      <div className="columns is-mobile is-vcentered is-multiline">
        <div className="column">
          <a
            href={`qw://${server.address}/observe`}
            className="button is-fullwidth is-small is-dark"
          >
            Spectate{" "}
            {server.spectator_slots.used > 0 && (
              <span className="ml-1 app-dim">
                ({server.spectator_slots.used})
              </span>
            )}
          </a>
        </div>

        {server.qtv_stream.address !== "" && (
          <div className="column">
            <a
              href={`qw://${server.qtv_stream.url}/qtvplay`}
              className="button is-fullwidth is-small is-dark"
            >
              QTV
              {server.qtv_stream.spectator_count > 0 && (
                <span className="ml-1 app-dim">
                  ({server.qtv_stream.spectator_count})
                </span>
              )}
            </a>
          </div>
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
    <div className="server-footer p-3">
      <SpectatorButtons server={server} />

      <div className="columns is-mobile is-vcentered app-text-small is-multiline">
        <div className="column">
          <div
            className="server-address"
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
              className="app-icon ml-1"
            />
          </div>
        </div>
        {server.settings.ktxver && (
          <KtxVersion version={server.settings.ktxver} />
        )}

        <div className="column is-narrow pl-0">
          <FavoriteToggle serverAddress={server.address} />
        </div>
      </div>
    </div>
  );
};

const ServerAddressTitle = React.memo((props) => {
  const { cc, title } = props;

  return (
    <span className="server-address-title">
      {cc && (
        <React.Fragment>
          <img
            src={`https://www.quakeworld.nu/images/flags/${cc.toLowerCase()}.gif`}
            width="16"
            height="11"
            alt={cc}
          />
          &nbsp;
        </React.Fragment>
      )}
      {title}
    </span>
  );
});

const KtxVersion = React.memo((props) => {
  const { version } = props;
  return (
    <div className="column is-narrow server-version" title={`KTX ${version}`}>
      KTX {version}
    </div>
  );
});

const getModifiers = (server) => {
  const modifiers = ["server-wrapper"];

  if (server.meta.showMatchtag) {
    modifiers.push("smod-matchtag");
  }

  if (server.meta.isStarted) {
    modifiers.push("smod-started");
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
    <div className={wrapperClassNames}>
      <div className="server">
        <ServerHeader server={server} />
        <ServerMapshot server={server} />
        <ServerFooter server={server} />
      </div>
    </div>
  );
}
