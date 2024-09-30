import { TwitchButton } from "@qwhub/Buttons";
import { useGetStreamsQuery } from "@qwhub/services/hub/hub";
import React from "react";

const ServersStreams = React.memo((props) => {
  const { address } = props;
  const { data: allStreams = [] } = useGetStreamsQuery(null, {
    pollingInterval: 15500,
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
    />
  ));
});
export default ServersStreams;
