import React from "react";
import { useGetStreamsQuery } from "@qwhub/services/hub/hub";
import { TwitchButton } from "./Buttons";

export default function Streams() {
  const { data: streams = [] } = useGetStreamsQuery(null, {
    pollingInterval: 15500,
  });

  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
      {streams.map((stream) => (
        <Stream key={stream.channel} stream={stream} />
      ))}
    </div>
  );
}

const Stream = (props) => {
  const { stream } = props;

  return <TwitchButton {...stream} className="block px-3 py-1.5 rounded-lg" />;
};
