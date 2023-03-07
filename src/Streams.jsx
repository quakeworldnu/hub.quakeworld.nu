import React from "react";
//import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  selectStreamChannels,
  selectStreamByChannel,
} from "./services/hub/streams.js";
import { useSelector } from "react-redux";
import { TwitchButton } from "./Buttons";

export default function Streams() {
  const streamChannels = useSelector(selectStreamChannels);

  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
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
