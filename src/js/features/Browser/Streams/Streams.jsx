import React from "react";

import { connect } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TextBlur } from "./../../Animations/Text.jsx";

const sortStreams = (a, b) => {
  let aLow = a.channel.toLowerCase();
  let bLow = b.channel.toLowerCase();
  if (aLow < bLow) {
    return -1;
  } else if (aLow > bLow) return 1;
  return 0;
};

export const Streams = (props) => {
  const [parent] = useAutoAnimate();
  const { servers } = props;
  let streams = [];

  servers.forEach((server) => {
    if (server.streams.length > 0) {
      streams = streams.concat(server.streams);
    }
  });

  streams = Array.from(new Set(streams));
  streams.sort(sortStreams);

  return (
    <>
      <div className="columns is-vcentered" ref={parent}>
        {streams.length > 0 &&
          streams.map((stream) => (
            <Stream key={stream.channel} stream={stream} />
          ))}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({ servers: state.browser.servers });
const StreamsComponent = connect(mapStateToProps)(Streams);

export default StreamsComponent;

const Stream = (props) => {
  const { stream } = props;

  return (
    <div className="column is-narrow mb-5">
      <a className="button is-dark is-large" href={stream.url}>
        <img
          src={`/assets/img/icons/twitch_glitch_purple.svg`}
          width="24"
          height="24"
          className="mr-2"
        />

        <span className="mr-4">
          <strong>{stream.channel}</strong>
        </span>

        <small className="app-dim app-text-smaller">
          <TextBlur key="title" value={stream.title} />
        </small>
      </a>
    </div>
  );
};
