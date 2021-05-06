import React from "react";
import { connect } from "react-redux";
import browserSlice from "./slice";
import { shuffleArray } from "./../../common/util";

const getClassNames = (server) => {
  const classNames = [];

  console.log(server.Settings);

  classNames.push("card");

  const isStandby = server.Description.indexOf("min left") === -1;

  if (isStandby) {
    classNames.push("status-standby");
  } else {
    classNames.push("status-active");
  }

  return classNames;
};

const Server = (props) => {
  const { server } = props;

  const gameMode = server.Description.split(", ")[0];
  const status = server.Settings.status;
  const players = server.Players.filter((p) => !p.Spec);
  const spectators = server.Players.filter((p) => p.Spec);
  const isStandby = server.Description.indexOf("min left") === -1;
  const isInProgress = !isStandby;
  const hasFreeSlots = players.length < server.MaxClients;
  const hasPlayers = players.length > 0;
  const isFfa = gameMode === "FFA";
  const canJoinGame = (isStandby || isFfa) && hasFreeSlots;
  let progressInMinutes = 0;

  if (isInProgress) {
    const minutesLeft = parseInt(status.replace(" min left", ""));
    progressInMinutes = server.Settings.timelimit - minutesLeft;
  }

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
            {(canJoinGame || !isInProgress) && (
              <div className="text-small">
                {players.length} of {server.MaxClients} players
              </div>
            )}
          </div>
          {canJoinGame && (
            <a href="#" className="button is-link">
              Join
            </a>
          )}
        </div>

        {isInProgress && (
          <div>
            <div className="columns is-mobile is-vcentered">
              <div className="column">
                <progress
                  className="progress is-small is-success"
                  style={{ height: "5px" }}
                  value={progressInMinutes}
                  max={server.Settings.timelimit}
                >
                  {progressInMinutes}%
                </progress>
              </div>
              <div className="column is-narrow text-small">{status}</div>
            </div>
          </div>
        )}
      </header>

      <hr className="m-0" />

      <div className="players" style={{ backgroundImage: mapThumbnailSrc }}>
        {hasPlayers && (
          <table className="player-table">
            <tr className="text-small">
              <th width="26">ping</th>
              <th width="30">frags</th>
              <th className="pl-3 has-text-left">name</th>
            </tr>
            {players.map((player, index) => (
              <tr key={index}>
                <td className="text-small">{player.Ping}</td>
                <td
                  className={`text-small has-text-weight-bold color-${player.Colors[0]}-${player.Colors[1]}`}
                >
                  {player.Frags}
                </td>
                <td className="has-text-weight-bold has-text-left pl-3">
                  {player.Name}
                </td>
              </tr>
            ))}
          </table>
        )}
        {!hasPlayers && (
          <div className="has-text-centered is-flex-grow-1">(no players)</div>
        )}
      </div>

      <hr className="m-0" />

      <div>
        <div className="p-3">
          <div className="text-small">
            {spectators.map((spec, index) => (
              <React.Fragment key={index}>
                <span className="has-text-grey mr-1">spec</span> {spec.Name}
                <br />
              </React.Fragment>
            ))}
          </div>
          <div className="mt-1 columns is-mobile">
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

      <footer className="card-footer p-3 text-small">
        <div>
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

class BrowserBps1 extends React.Component {
  componentDidMount() {
    const refreshInterval = 20000;

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

  componentWillUnmount() {
    clearInterval(this.fetchEntriesInterval);
  }

  render() {
    return (
      <div className="tiles">
        {this.props.servers &&
          this.props.servers.entries.map((entry, index) => {
            return (
              <div key={index} className="tile">
                <Server server={entry} />
              </div>
            );
          })}
      </div>
    );
  }
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = {
  updateEntries: browserSlice.actions.updateEntries,
};

const BrowserComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserBps1);

export default BrowserComponent;
