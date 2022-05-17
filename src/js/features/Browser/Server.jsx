import React from "react";
import FavoriteToggle from "./FavoriteToggle";
import { Scoreboard } from "./Scoreboard";
import { QuakeText } from "./Common";
import { copyToClipboard } from "../../common/clipboard";

const ServerProgress = (props) => {
  const { value, max } = props;

  const progress = 100 * (value / max);
  const width = `${progress}%`;

  return (<div className="server-progress">
    <div className="server-progress-bar" style={{ width }} />
  </div>);
};

const ServerHeader = (props) => {
  const { server } = props;

  return (<div className="server-header">
    <div className="is-flex is-justify-content-space-between p-3">
      <div>
        <strong className="has-text-white">{server.Mode}</strong> on{" "}
        <strong className="has-text-white">{server.Settings.map}</strong>
        <div className="app-text-small">
            <span className="server-status mr-1">
              {"Started" === server.Status &&
                (<span className="tag is-danger">LIVE</span>)}{" "}
              {"Standby" === server.Status &&
                (<div className="indicator-waiting-container">
                  <div className="indicator-waiting" />
                </div>)}
            </span>

          <span>{server.meta.statusText}</span>
        </div>
      </div>
      {(server.PlayerSlots.Free > 0) &&
        (<a href={`qw://${server.Address}/`} className="button is-primary">
          Join
        </a>)}
    </div>
    {server.Time.Total > 0 && server.meta.isStarted && (<ServerProgress
      value={server.Time.Elapsed}
      max={server.Time.Total}
    />)}
  </div>);
};

const ServerMapshot = (props) => {
  const { server } = props;

  const mapThumbnailSrc = server.Settings.map
    ? `url(https://vikpe.org/qw-mapshots/${server.Settings.map}.jpg)`
    : "none";

  return (<div className="server-mapshot-wrapper">
    <div
      className="server-mapshot"
      style={{ backgroundImage: mapThumbnailSrc }}
    >
      <div className="server-mapshot-dimmer">
        {("matchtag" in server.Settings) && (<div
          className="server-matchtag mb-4">{server.Settings.matchtag}</div>)}
        <Scoreboard
          server={server}
          limit={server.meta.playerDisplay.visible}
        />

        <HiddenPlayers count={server.meta.playerDisplay.hidden} />
        <SpectatorText text={server.meta.spectatorText} />

        {false && <pre>{JSON.stringify(server.meta.rows, null, 2)}</pre>}
      </div>
    </div>
  </div>);
};

const HiddenPlayers = (props) => {
  const { count } = props;

  if (0 === count) {
    return null;
  }

  const pluralize = (count) => (count > 1 ? "s" : "");

  return (<div className="mt-1 app-text-small">
    +{count} player{pluralize(count)}
  </div>);
};

const SpectatorText = (props) => {
  const { text } = props;

  if ("" === text) {
    return null;
  }

  return (<div className="spectator-text app-text-small mt-4">
    <span className="server-spectator-prefix">specs:</span>{" "}
    <QuakeText tag="span" text={text} />
  </div>);
};
const SpectatorButtons = (props) => {
  const { server } = props;

  return (<div>
    <div className="columns is-mobile is-vcentered">
      <div className="column">
        <a
          href={`qw://${server.Address}/observe`}
          className="button is-fullwidth is-small is-dark"
        >
          Spectate
        </a>
      </div>
      <div className="column">
        {(server.QtvStream !== "") && (<a
          href={`qw://${server.QtvStream.Url}/qtvplay`}
          className="button is-fullwidth is-small is-dark"
        >
          QTV
          {(server.QtvStream.NumSpectators > 0) && (<span
            className="ml-1 app-dim">({server.QtvStream.NumSpectators})</span>)}
        </a>)}
      </div>
    </div>
  </div>);
};
const ServerFooter = (props) => {
  const { server } = props;

  return (<div className="server-footer p-3">
    <SpectatorButtons server={server} />

    <div
      className="columns is-mobile is-vcentered app-text-small is-multiline">
      <div className="column">
        <div
          className="server-address"
          onClick={() => copyToClipboard(server.Address)}
          title="Copy IP to clipboard"
        >
            <span className="server-address-title">
              {server.Geo.CC && (<React.Fragment>
                <img
                  src={`https://badplace.eu/images/icons/flags/${server.Geo.CC.toLowerCase()}.png`}
                  width="16"
                  height="11"
                  style={{ maxHeight: "11px" }}
                  alt={server.Geo.Country}
                />
                &nbsp;
              </React.Fragment>)}
              {server.meta.addressTitle}
            </span>
          <img
            src="/assets/img/icons/content_paste.svg"
            width="12"
            className="app-icon ml-1"
          />
        </div>
      </div>
      {server.Settings.ktxver && (<div
        className="column is-narrow server-version"
        title={`KTX ${server.Settings.ktxver}`}
      >
        KTX {server.Settings.ktxver}
      </div>)}
      <div className="column is-narrow pl-0">
        <FavoriteToggle serverAddress={server.Address} />
      </div>
    </div>
  </div>);
};
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

  return (<div className={wrapperClassNames}>
    <div className="server">
      <ServerHeader server={server} />
      <ServerMapshot server={server} />
      <ServerFooter server={server} />
    </div>
  </div>);
};
