import { TwitchButton } from "@qwhub/Buttons";
import { hasClient } from "@qwhub/servers/util.ts";
import { useGetTwitchStreamsQuery } from "@qwhub/services/qworld/api";
import { streamClientName } from "@qwhub/services/qworld/twitch";
import React from "react";

const ServersStreams = React.memo((props) => {
  const { server } = props;
  const { data: allStreams = [] } = useGetTwitchStreamsQuery(null, {
    pollingInterval: 60_000,
  });
  const streamsOnServer = allStreams.filter((s) =>
    hasClient(server, streamClientName(s)),
  );

  if (0 === streamsOnServer.length) {
    return null;
  }

  return streamsOnServer.map((stream) => (
    <TwitchButton
      key={stream.user_login}
      login={stream.user_login}
      channel={stream.user_name}
      viewers={stream.viewer_count}
    />
  ));
});
export default ServersStreams;
