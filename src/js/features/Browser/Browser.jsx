import React from "react";
import { connect } from "react-redux";
import browserSlice from "./slice";
import { shuffleArray } from "./../../common/util";
import FilterForm from "./Filters";
import Overview from "./Overview";

const Server = (props) => {
  const { server } = props;

  const gameMode = server.Description.split(", ")[0];
  const status = server.Settings.status;
  const players = server.Players.filter((p) => !p.Spec);
  const spectators = server.Players.filter((p) => p.Spec);
  const isStandby = server.Description.indexOf("min left") === -1;
  const isInProgress = !isStandby;
  const missingPlayerCount = server.MaxClients - players.length;
  const hasFreeSlots = missingPlayerCount > 0;
  const hasPlayers = players.length > 0;
  const hasSpectators = spectators.length > 0;
  const isDuel = gameMode === "1v1";
  const isTeamplay = !isDuel && /\d+v\d+/gi.test(gameMode);
  const isCustomGameMode = !isTeamplay && !isDuel;
  const canJoinGame = (isStandby || isCustomGameMode) && hasFreeSlots;

  const classNames = ["server card"];

  if (canJoinGame) {
    classNames.push("status-canjoin");
  } else {
    classNames.push("status-isfull");
  }

  const classNamesStr = classNames.join(" ");

  let mapThumbnailSrc = "none";

  if (server.Map) {
    mapThumbnailSrc = `url(https://quakedemos.blob.core.windows.net/maps/thumbnails/${server.Map.toLowerCase()}.jpg)`;
  }

  return (
    <div className={classNamesStr}>
      <header className="p-3">
        <div className="is-flex is-justify-content-space-between">
          <div>
            <strong>{gameMode}</strong> on <strong>{server.Map}</strong>
            <div className="columns is-mobile is-vcentered app-text-small">
              <div className="column">
                {!isCustomGameMode && (
                  <React.Fragment>
                    {isInProgress && (
                      <React.Fragment>In progress, {status}</React.Fragment>
                    )}
                    {isStandby && canJoinGame && (
                      <span>Waiting for {missingPlayerCount} player(s)</span>
                    )}
                    {isStandby && !canJoinGame && (
                      <span>Waiting for players to ready up</span>
                    )}
                  </React.Fragment>
                )}
                {isCustomGameMode && (
                  <React.Fragment>In progress</React.Fragment>
                )}
              </div>
            </div>
          </div>
          {canJoinGame && (
            <a href={`qw://${server.Address}/`} className="button is-link">
              Join
            </a>
          )}
          {!canJoinGame && (
            <a
              href={`qw://${server.Address}/observe`}
              className="button is-disabled"
            >
              Join
            </a>
          )}
        </div>
      </header>

      <div className="players-outer">
        <div className="players" style={{ backgroundImage: mapThumbnailSrc }}>
          {hasPlayers && (
            <table className="player-table">
              <thead>
                <tr className="app-text-small">
                  <th width="30">ping</th>
                  <th width="30">frags</th>
                  {isTeamplay && <th width="60">team</th>}
                  <th className="pl-3 has-text-left">name</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={index}>
                    <td className="app-text-small">{player.Ping}</td>
                    <td
                      className={`app-text-small has-text-weight-bold color-${player.Colors[0]}-${player.Colors[1]}`}
                    >
                      {player.Frags}
                    </td>
                    {isTeamplay && <td>{player.Team}</td>}
                    <td className="has-text-weight-bold has-text-left pl-3">
                      {player.Name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!hasPlayers && (
            <div className="has-text-centered is-flex-grow-1">(no players)</div>
          )}
        </div>
      </div>

      <div>
        <div className="p-3">
          {hasSpectators && (
            <div className="app-text-small mb-3">
              {spectators.map((spec, index) => (
                <React.Fragment key={index}>
                  <span className="has-text-grey mr-1">spec</span> {spec.Name}
                  <br />
                </React.Fragment>
              ))}
            </div>
          )}
          <div className="columns is-mobile">
            <div className="column">
              <a
                href="#"
                className="button is-light is-link is-fullwidth is-small"
              >
                Spectate
              </a>
            </div>
            <div className="column">
              <a
                href="#"
                className="button is-light is-link is-fullwidth is-small"
              >
                QTV
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="card-footer px-3 py-2 app-text-small is-block">
        <div className="columns is-mobile is-vcentered is-justify-content-space-between">
          <div className="column is-narrow">
            {server.Country && (
              <img
                src={`https://badplace.eu/images/icons/flags/${server.Country.toLowerCase()}.png`}
                width="16"
                height="11"
                alt="{server.Country.toLowerCase()}"
              />
            )}{" "}
            {server.Address}
          </div>
          <div className="column is-narrow ml-auto has-text-grey">
            {server.Settings.ktxver && (
              <React.Fragment>KTX {server.Settings.ktxver}</React.Fragment>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

const serverEntriesProvider = {
  get: () => {
    const url = "/data/busy.json";
    const options = {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      redirect: "follow",
    };
    return fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        shuffleArray(data);
        return data;
      });
  },
};

class Browser extends React.Component {
  componentDidMount() {
    // const refreshInterval = 20000;

    const fetchAndUpdateEntries = () => {
      return serverEntriesProvider
        .get()
        .then((entries) => this.props.updateEntries({ entries }));
    };

    /*this.fetchEntriesInterval = setInterval(
      fetchAndUpdateEntries,
      refreshInterval,
    );*/
    fetchAndUpdateEntries();
  }

  /*
  componentWillUnmount() {
    clearInterval(this.fetchEntriesInterval);
  }
   */

  render() {
    const { servers } = this.props;
    const keyword = servers.ui.filters.keyword.toLowerCase();
    const serversEntries = servers.entries;

    let filteredServers;

    if (keyword) {
      const findPlayer = (keyword, players) =>
        players
          .map((p) => p.Name.toLowerCase())
          .join(" ")
          .indexOf(keyword) !== -1;

      const filterFunc = (server) => findPlayer(keyword, server.Players);
      filteredServers = serversEntries.filter(filterFunc);
    } else {
      filteredServers = serversEntries;
    }

    return (
      <React.Fragment>
        <div className="columns is-vcentered my-0">
          <div className="column is-narrow">
            <img src="/assets/img/qtvlogo.png" width="177" height="64" />
          </div>
          <div className="column">
            <Overview />
          </div>
          <div className="column is-narrow">
            <FilterForm />
          </div>
        </div>

        <div className="app-tiles">
          {filteredServers &&
            filteredServers.map((entry, index) => {
              return (
                <div key={index} className="app-tile">
                  <Server server={entry} />
                </div>
              );
            })}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = {
  updateEntries: browserSlice.actions.updateEntries,
};

const BrowserComponent = connect(mapStateToProps, mapDispatchToProps)(Browser);

export default BrowserComponent;
