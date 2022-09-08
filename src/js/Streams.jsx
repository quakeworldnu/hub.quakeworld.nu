import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { selectAllStreams, selectStreamById } from "./services/qws/streams.js";
import { useSelector } from "react-redux";
import { TwitchButton } from "./Buttons";

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

  return (
    <TwitchButton {...stream} className="block px-3 py-1.5" />
  );
};
