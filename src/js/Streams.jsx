import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  selectStreamChannels,
  selectStreamByChannel,
} from "./services/hub/streams.js";
import { useSelector } from "react-redux";
import { TwitchButton } from "./Buttons";

export default function Streams() {
  const [parent] = useAutoAnimate();
  const streamChannels = useSelector(selectStreamChannels);

  if (0 === streamChannels.length) {
    return <div ref={parent} />;
  }

  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4" ref={parent}>
      {streamChannels.map((channel) => (
        <Stream channel={channel} key={channel} />
      ))}
    </div>
  );
}

const Stream = ({ channel }) => {
  const stream = useSelector((state) => selectStreamByChannel(state, channel));

  return <TwitchButton {...stream} className="block px-3 py-1.5 rounded-lg" />;
};
