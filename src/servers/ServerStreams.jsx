import { TwitchButton } from "@qwhub/Buttons";
import { useGetStreamsQuery } from "@qwhub/services/hub/hub";
import React, { useState } from "react";
import { useTimeout } from "usehooks-ts";

function useDelay(delay) {
  const [skip, setSkip] = useState(true);
  useTimeout(() => {
    setSkip(false);
  }, delay);
  return skip;
}

const ServersStreams = React.memo((props) => {
  const skip = useDelay(1500);
  const { address } = props;
  const { data: allStreams = [] } = useGetStreamsQuery(null, {
    pollingInterval: 15500,
    skip,
  });
  const streamsOnServer = allStreams.filter(
    (s) => s.server_address === address,
  );

  if (0 === streamsOnServer.length) {
    return null;
  }

  return streamsOnServer.map((stream) => (
    <TwitchButton
      key={stream.channel}
      channel={stream.channel}
      viewers={stream.viewers}
      className="flex justify-center"
    />
  ));
});
export default ServersStreams;
