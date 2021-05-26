import FavoriteToggle from "./FavoriteToggle";
import React from "react";
import { quakeTextToHtml, copyToClipBoard } from "../../common/util";

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
    <td className="server-vspacer" colSpan={99} />
  </tr>
);

const PlayersTable = (props) => {
  const { players, isTeamplay } = props;
  return (
    <table className="servers-table">
      <thead>
        <tr>
          <th className="server-ping">ping</th>
          <th className="server-frags">frags</th>
          {isTeamplay && <th className="server-team">team</th>}
          <th className="server-name">name</th>
        </tr>
        <TableRowSpacer />
      </thead>
      <tbody>
        {players.map((player, index) => (
          <tr key={index}>
            <td className="server-ping">{player.Ping}</td>
            <ColoredFrags
              tag="td"
              frags={player.Frags}
              colors={player.Colors}
            />
            {isTeamplay && (
              <td
                className="server-team"
                dangerouslySetInnerHTML={{
                  __html: quakeTextToHtml(player.Team),
                }}
              />
            )}
            <td
              className="server-name"
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
    <table className="servers-table mb-4">
      <thead>
        <tr>
          <th className="server-ping">ping</th>
          <th className="server-frags">frags</th>
          <th className="server-team">team</th>
          <th>players</th>
        </tr>
        <TableRowSpacer />
      </thead>
      <tbody>
        {teams.map((team, index) => (
          <tr key={index}>
            <td className="server-ping">{team.avgPing}</td>
            <ColoredFrags tag="th" frags={team.frags} colors={team.colors} />
            <td
              className="server-team"
              dangerouslySetInnerHTML={{
                __html: quakeTextToHtml(team.name),
              }}
            />
            <td>{team.playerCount}</td>
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
    <TagName className={`server-frags qw-bgcolor-${colors[0]}-${colors[1]}`}>
      {frags}
    </TagName>
  );
};

const TwoTeamsTablePlayerCells = (player, keyPrefix) => {
  return [
    <td
      className="server-name"
      dangerouslySetInnerHTML={{ __html: quakeTextToHtml(player.Name) }}
      key={`${keyPrefix}-name`}
    />,
    <ColoredFrags
      tag="td"
      frags={player.Frags}
      colors={player.Colors}
      key={`${keyPrefix}-frags`}
    />,
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
      cells = cells.concat(
        TwoTeamsTablePlayerCells(teamOne.players[i], `left`)
      );
    }

    cells.push(<td className="server-hspacer" key={`spacer-${i}`} />);

    if (i <= teamTwo.playerCount) {
      let tmp = TwoTeamsTablePlayerCells(teamTwo.players[i], `right`);
      tmp.reverse();
      cells = cells.concat(tmp);
    }

    rows.push(<tr key={`row-${i}`}>{cells}</tr>);
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
            <th
              className="server-team"
              dangerouslySetInnerHTML={{
                __html: quakeTextToHtml(teamOne.name),
              }}
            />
            <ColoredFrags
              tag="th"
              frags={teamOne.frags}
              colors={teamOne.colors}
            />
            <th className="server-hspacer" />
            <ColoredFrags
              tag="th"
              frags={teamTwo.frags}
              colors={teamTwo.colors}
            />
            <th
              className="server-team"
              dangerouslySetInnerHTML={{
                __html: quakeTextToHtml(teamTwo.name),
              }}
            />
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

  let players = server.Players.filter((p) => !p.Spec);
  let spectators = server.Players.filter((p) => p.Spec);

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

          {!server.meta.hasClients && (
            <div className="has-text-centered">(no players)</div>
          )}

          {server.meta.hasSpectators && (
            <SpectatorList spectators={spectators} />
          )}
        </div>
      </div>
    </div>
  );
};
const SpectatorList = (props) => {
  const { spectators } = props;

  return (
    <div className="spectator-list mt-4 ml-2">
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
  );
};
const SpectatorButtons = (props) => {
  const { server } = props;

  return (
    <div>
      {false && (
        <div className="">
          <div className="columns is-mobile">
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
    <div className="server-footer p-3">
      <SpectatorButtons server={server} />

      <div className="columns is-mobile is-vcentered app-text-small is-multiline">
        <div className="column">
          <div
            className="server-address"
            onClick={() => copyToClipBoard(server.Address)}
            title="Copy IP to clipboard"
          >
            {server.Country && (
              <img
                src={`https://badplace.eu/images/icons/flags/${server.Country.toLowerCase()}.png`}
                width="16"
                height="11"
                alt={server.Country.toLowerCase()}
              />
            )}
            &nbsp;
            {server.Address}
            <img
              src="/assets/img/icons/content_paste.svg"
              width="12"
              className="app-icon ml-1"
            />
          </div>
        </div>
        {server.Settings.ktxver && (
          <div className="column is-narrow has-text-grey">
            KTX {server.Settings.ktxver}
          </div>
        )}
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
