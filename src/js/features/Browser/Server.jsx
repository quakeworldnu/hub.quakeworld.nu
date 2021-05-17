import FavoriteToggle from "./FavoriteToggle";
import React from "react";
import { quakeTextToHtml } from "../../common/util";

const ServerHeader = (props) => {
  const { server } = props;

  return (
    <div className="server-header">
      {server.meta.hasMatchtag && (
        <div className="server-matchtag p-3 has-text-weight-bold has-text-centered">
          {server.meta.matchtag}
        </div>
      )}
      <div className="is-flex is-justify-content-space-between p-3">
        <div>
          <strong className="has-text-white">{server.meta.mode.name}</strong> on{" "}
          <strong className="has-text-white">{server.Map}</strong>
          <div className="app-text-small level">
            <div className="level-left">
              <div className="level-item">
                <span className="server-status mr-1">
                  {server.meta.isStarted && (
                    <div className="indicator-started" />
                  )}{" "}
                  {server.meta.isWaitingForPlayersToReadyUp && (
                    <div className="indicator-waiting-container">
                      <div className="indicator-waiting" />
                    </div>
                  )}
                </span>

                <span>{server.meta.statusText}</span>
                {server.meta.isStarted && server.meta.minutesRemaining && (
                  <progress
                    className="progress ml-2"
                    value={server.meta.minutesElapsed}
                    max={server.meta.minutesTotal}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {server.meta.hasFreePlayerSlots && (
          <a href={`qw://${server.Address}/`} className="button is-primary">
            Join
          </a>
        )}
        {!server.meta.hasFreePlayerSlots && (
          <a
            href={`qw://${server.Address}/`}
            className="button"
            title="Server is full"
            disabled="disabled"
          >
            Join
          </a>
        )}
      </div>
    </div>
  );
};

const ServerPlayers = (props) => {
  const { server } = props;

  let players = [];

  if (server.meta.hasPlayers) {
    players = server.Players.filter((p) => !p.Spec);
  }

  let mapThumbnailSrc = "none";

  if (server.Map) {
    mapThumbnailSrc = `url(https://quakedemos.blob.core.windows.net/maps/thumbnails/${server.Map.toLowerCase()}.jpg)`;
  }

  return (
    <div className="server-players-wrapper">
      <div
        className="server-players"
        style={{ backgroundImage: mapThumbnailSrc }}
      >
        {server.meta.hasPlayers && (
          <table className="servers-player-table">
            <thead>
              <tr className="app-text-small">
                <th width="30">ping</th>
                <th width="30">frags</th>
                {server.meta.mode.isTeamplay && <th width="60">team</th>}
                <th className="pl-2 has-text-left">name</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index}>
                  <td className="app-text-small">{player.Ping}</td>
                  <td
                    className={`app-text-small has-text-weight-bold qw-bgcolor-${player.Colors[0]}-${player.Colors[1]}`}
                  >
                    {player.Frags}
                  </td>
                  {server.meta.mode.isTeamplay && (
                    <td
                      dangerouslySetInnerHTML={{
                        __html: quakeTextToHtml(player.Team),
                      }}
                    />
                  )}
                  <td
                    className="has-text-weight-bold has-text-left pl-2"
                    dangerouslySetInnerHTML={{
                      __html: quakeTextToHtml(player.Name),
                    }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!server.meta.playerCount && (
          <div className="has-text-centered is-flex-grow-1">(no players)</div>
        )}
      </div>
    </div>
  );
};

const ServerSpectators = (props) => {
  const { server } = props;

  let spectators = [];

  if (server.meta.hasSpectators) {
    spectators = server.Players.filter((p) => p.Spec);
  }

  return (
    <div className="server-spectators p-3">
      {(server.meta.hasSpectators || server.meta.hasQtvSpectators) && (
        <div className="app-text-small">
          <div className="columns is-mobile">
            <div className="column">
              {spectators.map((spec, index) => (
                <React.Fragment key={index}>
                  <span className="server-spectator-prefix">spec</span>{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: quakeTextToHtml(spec.Name),
                    }}
                  />
                  <br />
                </React.Fragment>
              ))}
            </div>

            <div className="column">
              {server.meta.hasQtvSpectators &&
                server.QTV[0].SpecList.map((spec, index) => (
                  <React.Fragment key={index}>
                    <span className="server-spectator-prefix">qtv</span>{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: quakeTextToHtml(spec),
                      }}
                    />
                    <br />
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      )}

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
              <span className="ml-1 app-dim">({server.QTV[0].Specs})</span>
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
    <div className="server-footer app-text-small p-3">
      <div className="columns is-mobile is-vcentered is-justify-content-space-between">
        <div className="column is-narrow">
          {server.Country && (
            <img
              src={`https://badplace.eu/images/icons/flags/${server.Country.toLowerCase()}.png`}
              width="16"
              height="11"
              align="center"
              alt={server.Country.toLowerCase()}
            />
          )}{" "}
          {server.Address}
        </div>
        <div className="column is-narrow has-text-grey">
          {server.Settings.ktxver && (
            <React.Fragment>KTX {server.Settings.ktxver}</React.Fragment>
          )}
        </div>
        <div className="column is-narrow">
          <FavoriteToggle serverAddress={server.Address} />
        </div>
      </div>
    </div>
  );
};
export const Server = (props) => {
  const { server } = props;

  const modifiers = ["server-border"];

  if (server.meta.hasMatchtag) {
    modifiers.push("smod-matchtag");
  }

  return (
    <div className={modifiers.join(" ")}>
      <div className="server">
        <ServerHeader server={server} />
        <ServerPlayers server={server} />
        <ServerSpectators server={server} />
        <ServerFooter server={server} />
      </div>
    </div>
  );
};
