import FavoriteToggle from "./FavoriteToggle";
import React from "react";
import { quakeTextToHtml } from "../../common/util";

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

const TableRowSpacer = () => (
  <tr>
    <td className="server-table-spacer" colSpan={99} />
  </tr>
);

const PlayersTable = (props) => {
  const { players, isTeamplay } = props;
  return (
    <table className="servers-table">
      <thead>
        <tr className="app-text-small">
          <th width="30" className="app-dim">
            ping
          </th>
          <th width="30">frags</th>
          {isTeamplay && <th width="60">team</th>}
          <th className="pl-2 has-text-left">name</th>
        </tr>
        <TableRowSpacer />
      </thead>
      <tbody>
        {players.map((player, index) => (
          <tr key={index}>
            <td className="app-text-small app-dim">{player.Ping}</td>
            <ColoredFrags
              tag="td"
              frags={player.Frags}
              colors={player.Colors}
            />
            {isTeamplay && (
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
  );
};

const TeamsTable = (props) => {
  const { teams } = props;
  return (
    <table className="servers-table mb-4" style={{ width: "1px" }}>
      <thead>
        <tr className="app-text-small">
          <th width="30" className="app-dim">
            ping
          </th>
          <th className="pl-2 has-text-left">team</th>
          <th width="30">frags</th>
          <th width="30">players</th>
        </tr>
        <TableRowSpacer />
      </thead>
      <tbody>
        {teams.map((team, index) => (
          <tr key={index}>
            <td className="app-text-small app-dim">{team.avgPing}</td>
            <td
              className="has-text-weight-bold has-text-left pl-2"
              dangerouslySetInnerHTML={{
                __html: quakeTextToHtml(team.name),
              }}
            />
            <td className="app-text-small has-text-weight-bold">
              {team.frags}
            </td>
            <td className="app-text-small">{team.playerCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ColoredFrags = (props) => {
  const { tag, frags, colors } = props;
  const TagName = `${tag}`;

  return (
    <TagName
      className={`server-frags app-text-small has-text-weight-bold qw-bgcolor-${colors[0]}-${colors[1]}`}
    >
      {frags}
    </TagName>
  );
};

const TwoTeamsTablePlayerCells = (player) => {
  return [
    <td className="app-text-small app-dim">{player.Ping}</td>,
    <td
      className="has-text-weight-bold"
      dangerouslySetInnerHTML={{ __html: quakeTextToHtml(player.Name) }}
    />,
    <ColoredFrags tag="td" frags={player.Frags} colors={player.Colors} />,
  ];
};

const TwoTeamsTableBody = (props) => {
  const { teamOne, teamTwo } = props;

  const maxTeamSize = Math.max(teamOne.playerCount, teamTwo.playerCount);

  const rows = [];
  let cells;

  for (let i = 0; i < maxTeamSize; i++) {
    cells = [];

    if (i <= teamOne.playerCount) {
      cells = cells.concat(TwoTeamsTablePlayerCells(teamOne.players[i]));
    }

    cells.push(<td />);

    if (i <= teamTwo.playerCount) {
      let tmp = TwoTeamsTablePlayerCells(teamTwo.players[i]);
      tmp.reverse();
      cells = cells.concat(tmp);
    }

    rows.push(<tr>{cells}</tr>);
  }

  return <tbody>{rows}</tbody>;
};

const TwoTeamsTable = (props) => {
  const { teams } = props;

  const teamOne = teams[0];
  const teamTwo = teams[1];

  return (
    <div className="is-flex is-justify-content-center">
      <table className="servers-table servers-table-two-teams">
        <thead>
          <tr>
            <th width="1" className="app-dim app-text-small">
              {teamOne.avgPing}
            </th>
            <th
              dangerouslySetInnerHTML={{
                __html: quakeTextToHtml(teamOne.name),
              }}
            />
            <ColoredFrags
              tag="th"
              frags={teamOne.frags}
              colors={teamOne.colors}
            />
            <th style={{ width: "1rem" }} />
            <ColoredFrags
              tag="th"
              frags={teamTwo.frags}
              colors={teamTwo.colors}
            />
            <th
              dangerouslySetInnerHTML={{
                __html: quakeTextToHtml(teamTwo.name),
              }}
            />
            <th width="1" className="app-dim app-text-small">
              {teamTwo.avgPing}
            </th>
          </tr>
          <TableRowSpacer />
        </thead>
        <TwoTeamsTableBody {...{ teamOne, teamTwo }} />
      </table>
    </div>
  );
};

const ServerMapshot = (props) => {
  const { server } = props;

  let players = [];

  if (server.meta.hasPlayers) {
    players = server.Players.filter((p) => !p.Spec);
  }

  let mapThumbnailSrc = "none";

  if (server.Map) {
    mapThumbnailSrc = `url(https://quakedemos.blob.core.windows.net/maps/thumbnails/${server.Map.toLowerCase()}.jpg)`;
  }

  const hasTwoTeams = 2 === server.meta.teams.length;

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

          {hasTwoTeams && <TwoTeamsTable teams={server.meta.teams} />}

          {!hasTwoTeams && (
            <React.Fragment>
              {server.meta.displayTeams && (
                <TeamsTable teams={server.meta.teams} />
              )}

              {server.meta.hasPlayers && (
                <PlayersTable
                  players={players}
                  isTeamplay={server.meta.mode.isTeamplay}
                />
              )}
            </React.Fragment>
          )}

          {!server.meta.hasPlayers && (
            <div className="has-text-centered">(no players)</div>
          )}
        </div>
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
        <div className="column">
          {server.Country && (
            <img
              src={`https://badplace.eu/images/icons/flags/${server.Country.toLowerCase()}.png`}
              width="16"
              height="11"
              alt={server.Country.toLowerCase()}
              className="server-flag"
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

  return (
    <div className={modifiers.join(" ")}>
      <div className="server">
        <ServerHeader server={server} />
        <ServerMapshot server={server} />
        <ServerSpectators server={server} />
        <ServerFooter server={server} />
      </div>
    </div>
  );
};
