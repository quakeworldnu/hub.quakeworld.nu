import React from "react";
import { connect } from "react-redux";
import browserSlice from "./slice";
import { randomString } from "./../../common/util";

// const url = "/data/busy.json";

const serverEntriesProvider = {
  get: async () => {
    const cacheBurstString = randomString(12);
    const url = `https://badplace.eu/api/v2/serverbrowser/busy?${cacheBurstString}`;
    const proxiedUrl = `https://api.allorigins.win/raw?url=${url}`;
    const options = {
      method: "GET",
      cache: "no-store",
    };
    return fetch(proxiedUrl, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => data)
      .catch((e) => {
        console.log("Network fetch error", e);
      });
  },
};

class ServerDataSource extends React.Component {
  componentDidMount() {
    const fetchAndupdateServers = () => {
      return serverEntriesProvider
        .get()
        .then((servers) => this.props.updateServers({ servers }));
    };

    const refreshInterval = 10 * 1000; // seconds
    this.timeout = window.setInterval(fetchAndupdateServers, refreshInterval);

    fetchAndupdateServers();
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
    console.log("bye!");
  }

  render() {
    return <React.Fragment />;
  }
}

const mapDispatchToProps = {
  updateServers: browserSlice.actions.updateServers,
};

const ServerDataSourceComponent = connect(
  null,
  mapDispatchToProps
)(ServerDataSource);

export default ServerDataSourceComponent;
