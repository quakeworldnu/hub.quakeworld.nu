import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TextBlur } from "./TextAnimations.jsx";
import { selectAllStreams, selectStreamById } from "./services/qws/streams.js";
import { useSelector } from "react-redux";
import { pluralize } from "./util/text.js";

export default function Streams() {
  const [parent] = useAutoAnimate();
  const streams = useSelector(selectAllStreams);

  if (0 === streams.length) {
    return <div ref={parent} />;
  }

  return (
    <div className="columns is-multiline is-mobile mb-3" ref={parent}>
      {streams.map((stream) => (
        <StreamById key={stream.channel} id={stream.channel} />
      ))}
    </div>
  );
}

const StreamById = ({ id }) => {
  const stream = useSelector((state) => selectStreamById(state, id));
  const { title, channel, viewers, url } = stream;

  console.log("stream.render", stream.url);

  return (
    <div className="column is-narrow">
      <a className="button is-fullwidth is-dark p-3" href={url}>
        <img
          src={`/assets/img/icons/twitch_glitch_purple.svg`}
          width="16"
          height="16"
          className="mr-2"
        />

        <span className="mr-2">
          <strong>{channel}</strong>
        </span>

        <span className="app-dim-light" style={{ fontSize: "13px" }}>
          (<TextBlur key="viewers" value={viewers} />{" "}
          {pluralize("viewer", viewers)})
          <span className="ml-3 is-hidden-mobile">
            <TextBlur key="title" value={title} />
          </span>
        </span>
      </a>
    </div>
  );
};
