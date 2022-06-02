import React from "react";

import { connect } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TextBlur } from "./../../Animations/Text.jsx";
import { previews } from "firebase-tools/lib/previews.js";

const sortStreams = (a, b) => {
  let aLow = a.channel.toLowerCase();
  let bLow = b.channel.toLowerCase();
  if (aLow < bLow) {
    return -1;
  } else if (aLow > bLow) return 1;
  return 0;
};

export const Streams = (props) => {
  const { streams } = props;

  const [parent] = useAutoAnimate();

  if (0 === streams.length) {
    return <div ref={parent} />;
  }

  return (
    <div className="columns is-multiline is-mobile mb-3" ref={parent}>
      {streams.map((stream) => (
        <Stream
          key={stream.id}
          channel={stream.user_login}
          title={stream.title}
          viewers={stream.viewer_count}
        />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({ streams: state.browser.streams });
const StreamsComponent = connect(mapStateToProps)(Streams);

export default StreamsComponent;

const Stream = React.memo((props) => {
  const { channel, title, viewers } = props;

  return (
    <div className="column is-narrow">
      <a
        className="button is-fullwidth is-dark p-3"
        href={`https://twitch.tv/${channel}`}
      >
        <img
          src={`/assets/img/icons/twitch_glitch_purple.svg`}
          width="16"
          height="16"
          className="mr-2"
        />

        <span className="mr-4">
          <strong>{channel}</strong>
        </span>

        <span
          className="app-dim-light is-hidden-mobile"
          style={{ fontSize: "13px" }}
        >
          <TextBlur key="title" value={title} /> (
          <TextBlur key="viewers" value={viewers} />)
        </span>
      </a>
    </div>
  );
});
