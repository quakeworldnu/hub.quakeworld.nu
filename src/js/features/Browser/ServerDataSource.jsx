import React from "react";
import { connect } from "react-redux";
import browserSlice from "./slice";

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

class ServerDataSource extends React.Component {
  componentDidMount() {
    const fetchAndupdateServers = () => {
      return serverEntriesProvider
        .get()
        .then((servers) => this.props.updateServers({ servers }));
    };

    fetchAndupdateServers();
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
