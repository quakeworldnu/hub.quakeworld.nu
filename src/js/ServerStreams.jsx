import React from "react";
import { selectStreamsByServerAddress } from "./services/hub/streams.js";
import { useSelector } from "react-redux";
import { TwitchButton } from "./Buttons";

const ServersStreams = React.memo((props) => {
  const { address } = props;
  const streams = useSelector((state) =>
    selectStreamsByServerAddress(state, address)
  );

  if (0 === streams.length) {
    return null;
  }

  return streams.map((stream) => (
    <TwitchButton
      key={stream.channel}
      channel={stream.channel}
      viewers={stream.viewers}
      className="flex justify-center"
    />
  ));
});
export default ServersStreams;
