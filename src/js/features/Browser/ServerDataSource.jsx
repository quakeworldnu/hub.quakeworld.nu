import React from "react";
import { connect } from "react-redux";
import browserSlice from "./slice";

// const url = "/data/busy.json";
const serverEntriesProvider = {
  get: async () => {
    const url = "https://metaqtv.quake.se/v2/mvdsv?limit=50";
    // const fakeDataUrl = "/data/busy.json"; // static/fake data for (development)
    const options = {
      method: "GET",
      cache: "no-store",
    };
    return fetch(url, options)
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

class ServerDataSource extends React.PureComponent {
  componentDidMount() {
    const fetchAndupdateServers = () => {
      return serverEntriesProvider
        .get()
        .then((servers) => this.props.updateServers({ servers }));
    };

    const refreshInterval = 2.9 * 1000; // seconds
    this.timeout = window.setInterval(fetchAndupdateServers, refreshInterval);

    fetchAndupdateServers();
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
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
