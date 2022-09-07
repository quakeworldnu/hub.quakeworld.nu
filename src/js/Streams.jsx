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
    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4" ref={parent}>
      {streams.map((stream) => (
        <StreamById id={stream.channel} key={stream.channel} />
      ))}
    </div>
  );
}

const StreamById = ({ id }) => {
  const stream = useSelector((state) => selectStreamById(state, id));
  const { title, channel, viewers, url } = stream;

  return (
    <a href={url}
       title={title}
       className="block py-2 px-3 rounded-md border border-blue-600/20 bg-blue-800/20 hover:bg-blue-800/40 hover:border-blue-600/40">
      <span className="whitespace-nowrap space-x-1">
        <img
          src={`/assets/img/icons/twitch_glitch_purple.svg`}
          width="16"
          height="16"
          className="inline"
        />
        <strong>{channel}</strong>
        <span className="text-gray-400 text-xs">(<TextBlur key="viewers" value={viewers} />)</span>
      </span>

      <div className="text-gray-400 text-sm mt-1 sm:max-w-[420px] truncate">
        <TextBlur key="title" value={title} />
      </div>
    </a>
  );
};
