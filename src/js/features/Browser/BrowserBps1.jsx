import React from "react";
import { connect } from "react-redux";
import browserSlice from "./slice";
import { shuffleArray } from "./../../common/util";

const getClassNames = (server) => {
  const classNames = [];

  classNames.push("item");

  return classNames;
};

const Server = (props) => {
  const { server } = props;
  const classNamesStr = getClassNames(server).join(" ");
  const gameMode = server.Description.split(", ")[0];
  const players = server.Players.filter((p) => !p.Spec);
  const spectators = server.Players.filter((p) => p.Spec);

  return (
    <div className={classNamesStr}>
      <div className="header">
        <div className="mapname">{server.Settings.map}</div>
        <div className="mode">{gameMode}</div>
      </div>

      <div className="players">
        {players.map((player, index) => (
          <React.Fragment key={index}>
            <span className="playercolor" /> {player.Name}
            <br />
          </React.Fragment>
        ))}
      </div>

      <div className="specs">
        {spectators.map((spec, index) => (
          <React.Fragment key={index}>
            <span className="speccolor">spectator</span> {spec.Name}
            <br />
          </React.Fragment>
        ))}
      </div>

      <div className="bottom">
        {server.Address}
        <div className="serverdetails">
          <a href="#">QTV&nbsp;&nbsp;</a>
          <a href="#">Spectate&nbsp;&nbsp;</a>
          <a href="#">Join</a>
        </div>
      </div>
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

    this.fetchEntriesInterval = setInterval(
      fetchAndUpdateEntries,
      refreshInterval
    );
    fetchAndUpdateEntries();
  }

  componentWillUnmount() {
    clearInterval(this.fetchEntriesInterval);
  }

  render() {
    console.log("Browser::render()");

    return (
      <div className="masonry">
        {this.props.servers &&
          this.props.servers.entries.map((entry, index) => {
            return (
              <div key={index} className="tile is-parent">
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
