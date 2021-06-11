import FavoriteToggle from "./FavoriteToggle";
import { Scoreboard } from "./Scoreboard";
import { QuakeText } from "./Common";
import React from "react";
import { copyToClipBoard } from "../../common/util";

const ServerProgress = (props) => {
  const { value, max } = props;

  const progress = 100 * (value / max);
  const width = `${progress}%`;

  return (
    <div className="server-progress">
      <div className="server-progress-bar" style={{ width }} />
    </div>
  );
};

const ServerHeader = (props) => {
  const { server } = props;

  return (
    <div className="server-header">
      <div className="is-flex is-justify-content-space-between p-3">
        <div>
          <strong className="has-text-white">{server.meta.mode.name}</strong> on{" "}
          <strong className="has-text-white">{server.Map}</strong>
          <div className="app-text-small">
            <span className="server-status mr-1">
              {server.meta.isStarted && (
                <span className="tag is-danger">LIVE</span>
              )}{" "}
              {server.meta.isStandby && (
                <div className="indicator-waiting-container">
                  <div className="indicator-waiting" />
                </div>
              )}
            </span>

            <span>{server.meta.statusText}</span>
          </div>
        </div>
        {server.meta.hasFreePlayerSlots && (
          <a href={`qw://${server.Address}/`} className="button is-primary">
            Join
          </a>
        )}
      </div>
      {server.meta.displayProgress && (
        <ServerProgress
          value={server.meta.minutesElapsed}
          max={server.meta.minutesTotal}
        />
      )}
    </div>
  );
};

const ServerMapshot = (props) => {
  const { server } = props;

  let spectators = server.Players.filter((p) => p.Spec);

  let mapThumbnailSrc = "none";

  if (server.Map) {
    mapThumbnailSrc = `url(https://vikpe.org/qwmapshots/${server.Map}.jpg)`;
  }

  return (
    <div className="server-mapshot-wrapper">
      <div
        className="server-mapshot"
        style={{ backgroundImage: mapThumbnailSrc }}
      >
        <div className="server-mapshot-dimmer">
          {server.meta.hasMatchtag && (
            <div className="server-matchtag mb-4">{server.meta.matchtag}</div>
          )}

          <Scoreboard server={server} />

          <SpectatorList spectators={spectators} />
        </div>
      </div>
    </div>
  );
};

const SpectatorList = (props) => {
  const { spectators } = props;

  if (0 === spectators.length) {
    return null;
  }

  return (
    <div className="spectator-list mt-4">
      {spectators.map((spec, index) => (
        <div key={index}>
          <span className="server-spectator-prefix">spectator</span>{" "}
          <QuakeText tag="span" text={spec.Name} />
        </div>
      ))}
    </div>
  );
};
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
            Spectate
          </a>
        </div>
        <div className="column">
          {server.meta.hasQtv && (
            <a
              href={`qw://${server.QTV[0].Address}/qtvplay`}
              className="button is-fullwidth is-small is-dark"
            >
              QTV
              {server.meta.hasQtvSpectators && (
                <span className="ml-1 app-dim">({server.QTV[0].Specs})</span>
              )}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
const ServerFooter = (props) => {
  const { server } = props;

  return (
    <div className="server-footer p-3">
      <SpectatorButtons server={server} />

      <div className="columns is-mobile is-vcentered app-text-small is-multiline">
        <div className="column">
          <div
            className="server-address"
            onClick={() => copyToClipBoard(server.Address)}
            title="Copy IP to clipboard"
          >
            <span className="server-address-title">
              {server.Country && (
                <React.Fragment>
                  <img
                    src={`https://badplace.eu/images/icons/flags/${server.Country.toLowerCase()}.png`}
                    width="16"
                    height="11"
                    style={{ maxHeight: "11px" }}
                    alt={server.Country.toLowerCase()}
                  />
                  &nbsp;
                </React.Fragment>
              )}
              {server.meta.addressTitle}
            </span>
            <img
              src="/assets/img/icons/content_paste.svg"
              width="12"
              className="app-icon ml-1"
            />
          </div>
        </div>
        {server.Settings.ktxver && (
          <div className="column is-narrow has-text-grey app-text-small">
            KTX {server.Settings.ktxver}
          </div>
        )}
        <div className="column is-narrow pl-0">
          <FavoriteToggle serverAddress={server.Address} />
        </div>
      </div>
    </div>
  );
};
const getModifiers = (meta) => {
  const modifiers = ["server-wrapper"];

  if (meta.hasMatchtag) {
    modifiers.push("smod-matchtag");
  }

  if (meta.isStarted) {
    modifiers.push("smod-started");
  }

  if (meta.hasFreePlayerSlots) {
    modifiers.push("smod-hasfreeplayerslots");
  } else if (meta.isWaitingForPlayersToReadyUp) {
    modifiers.push("smod-waitingforready");
  }

  return modifiers;
};
export const Server = (props) => {
  const { server } = props;

  const modifiers = getModifiers(server.meta);
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
