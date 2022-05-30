import React from "react";

import { connect } from "react-redux";

export const Streams = (props) => {
  const { servers } = props;

  let streams = [];

  servers.forEach((server) => {
    if (server.streams.length > 0) {
      streams = streams.concat(server.streams);
    }
  });

  streams = Array.from(new Set(streams));

  return (
    <>
      <StreamList streams={streams} />
    </>
  );
};

const mapStateToProps = (state) => ({ servers: state.browser.servers });
const StreamsComponent = connect(mapStateToProps)(Streams);

export default StreamsComponent;

const StreamList = (props) => {
  const { streams } = props;

  if (0 === streams.length) {
    return <></>;
  }

  return (
    <div className="columns is-vcentered mb-5 is-multiline">
      {streams.map((stream) => (
        <Stream key={stream.channel} stream={stream} />
      ))}
    </div>
  );
};

const Stream = (props) => {
  const { stream } = props;

  return (
    <div className="column is-narrow">
      <a className="button is-dark is-large" href={stream.url}>
        <img
          src={`/assets/img/icons/twitch_glitch_purple.svg`}
          width="24"
          height="24"
          className="mr-2"
        />

        <span className="mr-2">
          <strong>{stream.channel}</strong>
        </span>

        <small className="app-dim app-text-smaller">
          &nbsp; {stream.title}
        </small>
      </a>
    </div>
  );
};
