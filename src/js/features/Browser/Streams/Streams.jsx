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
      <div className="columns is-multiline is-mobile mb-4" ref={parent}>
        {streams.length > 0 &&
          streams.map((stream) => (
            <Stream key={stream.channel} channel={stream.channel} title={stream.title} />
          ))}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({ servers: state.browser.servers });
const StreamsComponent = connect(mapStateToProps)(Streams);

export default StreamsComponent;

const Stream = React.memo((props) => {
  const { channel, title } = props;

  return (
    <div className="column is-narrow">
      <a className="button is-fullwidth is-dark p-3" href={`https://twitch.tv/${channel}`}>
        <img
          src={`/assets/img/icons/twitch_glitch_purple.svg`}
          width="16"
          height="16"
          className="mr-2"
        />

        <span className="mr-4">
          <strong>{channel}</strong>
        </span>

        <span className="app-dim-light is-hidden-mobile" style={{fontSize: "13px"}}>
          <TextBlur key="title" value={title} />
        </span>
      </a>
    </div>
  );
});
