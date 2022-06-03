import React from "react";

import { connect } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TextBlur } from "./../../Animations/Text.jsx";

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
          key={stream.player}
          {...stream}
        />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({ streams: state.browser.streams });
const StreamsComponent = connect(mapStateToProps)(Streams);

export default StreamsComponent;

const Stream = React.memo((props) => {
  const { title, channel, viewers, url } = props;

  return (
    <div className="column is-narrow">
      <a
        className="button is-fullwidth is-dark p-3"
        href={url}
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
