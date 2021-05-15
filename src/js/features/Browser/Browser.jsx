import React from "react";
import { connect } from "react-redux";
import browserSlice from "./slice";
import { quakeTextToHtml } from "../../common/util";
import FilterForm from "./Filters";
import Overview from "./Overview";

const Server = (props) => {
  const { server } = props;

  let players = [];

  if (server.meta.hasPlayers) {
    players = server.Players.filter((p) => !p.Spec);
  }

  let spectators = [];

  if (server.meta.hasSpectators) {
    spectators = server.Players.filter((p) => p.Spec);
  }

  const classNames = ["server card"];
  const classNamesStr = classNames.join(" ");

  let mapThumbnailSrc = "none";

  if (server.Map) {
    mapThumbnailSrc = `url(https://quakedemos.blob.core.windows.net/maps/thumbnails/${server.Map.toLowerCase()}.jpg)`;
  }

  return (
    <div className={classNamesStr}>
      <header className="p-1 mb-1">
        {server.meta.hasMatchtag && (
          <div className="server-matchtag has-text-success has-text-weight-bold has-text-centered py-1 pb-3">
            {server.meta.matchtag}
          </div>
        )}

        <div className="is-flex is-justify-content-space-between">
          <div>
            <strong>{server.meta.mode.name}</strong> on{" "}
            <strong>{server.Map}</strong>
            <div className="columns is-mobile is-vcentered app-text-small">
              <div className="column">
                <span className="server-status" />
                {server.meta.statusText}
              </div>
            </div>
          </div>
          {server.meta.hasFreePlayerSlots && (
            <a href={`qw://${server.Address}/`} className="button is-link">
              Join
            </a>
          )}
          {!server.meta.hasFreePlayerSlots && (
            <a
              href={`qw://${server.Address}/observe`}
              className="button is-disabled"
            >
              Join
            </a>
          )}
        </div>
      </header>

      {false && (
        <div>
          <pre>{JSON.stringify(server.meta, null, 2)}</pre>
        </div>
      )}

      <div className="players-outer">
        <div className="players" style={{ backgroundImage: mapThumbnailSrc }}>
          {server.meta.hasPlayers && (
            <table className="player-table">
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

      <div className="py-3 px-1">
        {(server.meta.hasSpectators || server.meta.hasQtvSpectators) && (
          <div className="app-text-small mb-3">
            {spectators.map((spec, index) => (
              <React.Fragment key={index}>
                <span className="app-spectator-prefix has-text-grey has-text-right">
                  spec
                </span>{" "}
                <span
                  dangerouslySetInnerHTML={{
                    __html: quakeTextToHtml(spec.Name),
                  }}
                />
                <br />
              </React.Fragment>
            ))}
            {server.meta.hasQtvSpectators &&
              server.QTV[0].SpecList.map((spec, index) => (
                <React.Fragment key={index}>
                  <span className="app-spectator-prefix has-text-grey has-text-right">
                    qtv
                  </span>{" "}
                  {spec}
                  <br />
                </React.Fragment>
              ))}
          </div>
        )}

        <div className="columns is-mobile">
          <div className="column">
            <a
              href={`qw://${server.Address}/observe`}
              className="button is-dark is-fullwidth is-small"
            >
              Spectate
            </a>
          </div>

          <div className="column">
            {server.meta.hasQtv && (
              <a
                href={`qw://${server.QTV[0].address}/qtvplay`}
                className="button is-dark is-fullwidth is-small"
              >
                QTV
                <span className="ml-1 has-text-grey">
                  ({server.QTV[0].Specs})
                </span>
              </a>
            )}
          </div>
        </div>
      </div>

      <footer className="card-footer p-1 pt-2 app-text-small is-block">
        <div className="columns is-mobile is-vcentered is-justify-content-space-between">
          <div className="column is-narrow">
            {server.Country && (
              <img
                src={`https://badplace.eu/images/icons/flags/${server.Country.toLowerCase()}.png`}
                width="16"
                height="11"
                align="center"
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

    if (keyword.length > 1) {
      const searchKeywordParts = keyword.split(" ");

      const filterFunc = (server) => {
        return searchKeywordParts.every((kw) => {
          return server.meta.keywords.indexOf(kw) !== -1;
        });
      };
      filteredServers = serversEntries.filter(filterFunc);
    } else {
      filteredServers = serversEntries;
    }

    const hasFilterResults = filteredServers.length > 0;

    const sortedFilteredServers = [...filteredServers].sort(compareServers);

    return (
      <React.Fragment>
        <div className="columns is-vcentered my-0">
          <div className="column is-narrow">
            <a href="/">
              <img src="/assets/img/qtvlogo.png" width="177" height="64" />
            </a>
          </div>
          <div className="column">
            <Overview />
          </div>
          <div className="column is-narrow">
            <FilterForm />
          </div>
        </div>

        <div className="app-tiles">
          {hasFilterResults &&
            sortedFilteredServers.map((entry, index) => {
              return (
                <div key={index} className="app-tile">
                  <Server server={entry} />
                </div>
              );
            })}
          {!hasFilterResults && (
            <span className="has-text-grey">(no results found)</span>
          )}
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
