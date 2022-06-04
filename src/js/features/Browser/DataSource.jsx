import React from "react";
import { connect } from "react-redux";
import browserSlice from "./slice";

// const url = "/data/busy.json";
const fetchGet = async (url) => {
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
};

class DataSource extends React.PureComponent {
  componentDidMount() {
    // servers
    const fetchAndUpdateServers = () =>
      fetchGet("https://metaqtv.quake.se/v2/mvdsv?limit=50")
        .then((servers) => this.props.updateServers({ servers }))
        .catch((e) => console.log("Error fetching servers", e));

    this.serversTimeout = window.setInterval(fetchAndUpdateServers, 2.9 * 1000);
    fetchAndUpdateServers();
  }

  componentWillUnmount() {
    window.clearTimeout(this.serversTimeout);
  }

  render() {
    return <React.Fragment />;
  }
}

const mapDispatchToProps = {
  updateServers: browserSlice.actions.updateServers,
};

const ServerDataSourceComponent = connect(null, mapDispatchToProps)(DataSource);

export default ServerDataSourceComponent;
