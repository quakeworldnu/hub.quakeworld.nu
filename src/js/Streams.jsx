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
        <div className="column is-narrow my-2 mr-3" key={stream.channel}>
          <StreamById id={stream.channel} />
        </div>
      ))}
    </div>
  );
}

const StreamById = ({ id }) => {
  const stream = useSelector((state) => selectStreamById(state, id));
  const { title, channel, viewers, url } = stream;

  return (
    <a href={url} className="p-3 rounded-md border border-blue-600/20 bg-blue-800/20 hover:bg-blue-800/40 hover:border-blue-600/40">
      <img
        src={`/assets/img/icons/twitch_glitch_purple.svg`}
        width="16"
        height="16"
        className="inline mr-2"
      />

      <span className="mr-1 font-bold">{channel}</span>

      <span className="text-gray-300/50 text-sm space-x-2">
        (<TextBlur key="viewers" value={viewers} />)
        <TextBlur key="title" value={title} />
      </span>
    </a>
  );
};
