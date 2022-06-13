import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TextBlur } from "./TextAnimations.jsx";
import { selectAllStreams, selectStreamById } from "./services/qws/streams.js";
import { useSelector } from "react-redux";

export default function Streams() {
  const [parent] = useAutoAnimate();
  const streams = useSelector(selectAllStreams);

  if (0 === streams.length) {
    return <div ref={parent} />;
  }

  return (
    <div className="columns is-multiline is-gapless" ref={parent}>
      {streams.map((stream) => (
        <div className="column is-narrow my-2 mr-3">
          <StreamById key={stream.channel} id={stream.channel} />
        </div>
      ))}
    </div>
  );
}

const StreamById = ({ id }) => {
  const stream = useSelector((state) => selectStreamById(state, id));
  const { title, channel, viewers, url } = stream;

  return (
    <a className="button is-dark app-stream" href={url}>
      <img
        src={`/assets/img/icons/twitch_glitch_purple.svg`}
        width="16"
        height="16"
        className="mr-2"
      />

      <span className="mr-1">
        <strong>{channel}</strong>
      </span>

      <span className="app-dim-light app-text-small">
        (<TextBlur key="viewers" value={viewers} />)
      </span>

      <span className="app-dim-light app-text-small app-stream-title ml-2">
        <TextBlur key="title" value={title} />
      </span>
    </a>
  );
};
