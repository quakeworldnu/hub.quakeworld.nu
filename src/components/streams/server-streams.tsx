import React from "react";
import { useTwitchStreams } from "@/lib/qworld/queries";
import { hasClient } from "@/lib/qworld/server-utils";
import { isHighlightedStream, streamClientName } from "@/lib/qworld/twitch";
import type { Server } from "@/lib/qworld/types";
import { TwitchButton } from "./twitch-button";

const ServersStreams = React.memo((props: { server: Server }) => {
  const { server } = props;
  // polled by <TwitchStreamsPoller /> (site header)
  const allStreams = useTwitchStreams();
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
      label={streamClientName(stream)}
      viewers={stream.viewer_count}
      highlight={isHighlightedStream(stream)}
    />
  ));
});
export default ServersStreams;
