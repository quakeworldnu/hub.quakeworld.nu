import React from "react";

import { connect } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TextBlur } from "./../../Animations/Text.jsx";

const sortStreams = (a, b) => {
  let aLow = a.user_login.toLowerCase();
  let bLow = b.user_login.toLowerCase();
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

  streams.sort(sortStreams);

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

        <span className="mr-2">
          <strong>{channel}</strong>
        </span>

        <span
          className="app-dim-light"
          style={{ fontSize: "13px" }}
        >
        (<TextBlur key="viewers" value={viewers} /> viewers)

        <span className="ml-3 is-hidden-mobile">
          <TextBlur key="title" value={title} />
        </span>
        </span>
      </a>
    </div>
  );
});
