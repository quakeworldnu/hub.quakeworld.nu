import React from "react";
import FavoriteToggle from "./FavoriteToggle";
import { Scoreboard } from "./Scoreboard";
import { QuakeText } from "./Common";
import { copyToClipboard } from "../../common/clipboard";
import { pluralize } from "../../common/text.js";
import { TextBlur } from "../Animations/Text.jsx";

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
          mode={server.Mode}
          map={server.Settings.map}
          status={server.Status}
          statusText={server.meta.statusText}
        />
        {server.PlayerSlots.Free > 0 && (
          <a href={`qw://${server.Address}/`} className="button is-primary">
            Play
          </a>
        )}
      </div>
      {server.Time.Total > 0 &&
        ["Started", "Countdown"].includes(server.Status) && (
          <ServerProgress value={server.Time.Elapsed} max={server.Time.Total} />
        )}
    </div>
  );
};

const ServerStatus = React.memo((props) => {
  const { mode, map, status, statusText } = props;

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
          {["Started", "Countdown"].includes(status) && (
            <span className="tag is-danger">LIVE</span>
          )}{" "}
          {"Standby" === status && (
            <div className="indicator-waiting-container">
              <div className="indicator-waiting" />
            </div>
          )}
        </span>

        <span>{statusText}</span>
      </div>
    </div>
  );
});

const ServerMapshot = (props) => {
  const { server } = props;

  const mapThumbnailSrc = server.Settings.map
    ? `url(https://vikpe.org/qw-mapshots/${server.Settings.map}.jpg)`
    : "none";

  return (
    <div className="server-mapshot-wrapper">
      <div
        className="server-mapshot"
        style={{ backgroundImage: mapThumbnailSrc }}
      >
        <div className="server-mapshot-dimmer">
          {"matchtag" in server.Settings && (
            <div className="server-matchtag mb-4">
              {server.Settings.matchtag}
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
      <div className="columns is-mobile is-vcentered">
        <div className="column">
          <a
            href={`qw://${server.Address}/observe`}
            className="button is-fullwidth is-small is-dark"
          >
            Spectate{" "}
            {server.SpectatorSlots.Used > 0 && (
              <span className="ml-1 app-dim">
                ({server.SpectatorSlots.Used})
              </span>
            )}
          </a>
        </div>

        {server.QtvStream.Address !== "" && (
          <div className="column">
            <a
              href={`qw://${server.QtvStream.Url}/qtvplay`}
              className="button is-fullwidth is-small is-dark"
            >
              QTV
              {server.QtvStream.SpectatorCount > 0 && (
                <span className="ml-1 app-dim">
                  ({server.QtvStream.SpectatorCount})
                </span>
              )}
            </a>
          </div>
        )}

        {server.streams.map(
          stream => (
            <div className="column" key={stream.channel}>
              <StreamButton channel={stream.channel} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

const StreamButton = React.memo((props) => {
  const { channel } = props;
  const url = `https://twitch.tv/${channel}`

  return (
    <a
      href={url}
      className="button is-fullwidth is-small is-dark"
    >
      <img
        src={`/assets/img/icons/twitch_glitch_purple.svg`}
        width="16"
        height="16"
        className="mx-2"
        alt={url}
      />
      {channel}
    </a>
  )
});

const ServerFooter = (props) => {
  const { server } = props;

  return (
    <div className="server-footer p-3">
      <SpectatorButtons server={server} />

      <div
        className="columns is-mobile is-vcentered app-text-small is-multiline">
        <div className="column">
          <div
            className="server-address"
            onClick={() => copyToClipboard(server.Address)}
            title="Copy IP to clipboard"
          >
            <ServerAddressTitle
              cc={server.Geo.CC}
              title={server.meta.addressTitle}
            />
            <img
              src="/assets/img/icons/content_paste.svg"
              width="12"
              className="app-icon ml-1"
            />
          </div>
        </div>
        {server.Settings.ktxver && (
          <KtxVersion version={server.Settings.ktxver} />
        )}

        <div className="column is-narrow pl-0">
          <FavoriteToggle serverAddress={server.Address} />
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
            src={`https://badplace.eu/images/icons/flags/${cc.toLowerCase()}.png`}
            width="16"
            height="11"
            style={{ maxHeight: "11px" }}
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

  if ("matchtag" in server.Settings) {
    modifiers.push("smod-matchtag");
  }

  if (server.meta.isStarted) {
    modifiers.push("smod-started");
  }

  if (server.PlayerSlots.Free > 0) {
    modifiers.push("smod-hasfreeplayerslots");
  } else if (server.meta.isStandBy) {
    modifiers.push("smod-waitingforready");
  }

  return modifiers;
};
export const Server = (props) => {
  const { server } = props;

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
};
