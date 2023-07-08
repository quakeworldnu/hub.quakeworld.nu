import React from "react";
import { useGetStreamsQuery } from "@/services/hub/hub";
import { TwitchButton } from "@/Buttons";

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
      className="flex justify-center"
    />
  ));
});
export default ServersStreams;
