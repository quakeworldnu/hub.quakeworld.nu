import { Fragment } from "react";
import { Heading } from "@/components/ui/heading";
import { useTwitchStreams } from "@/lib/qworld/queries";
import {
  featuredFirst,
  streamClientName,
  streamUrl,
} from "@/lib/qworld/twitch";
import type { TwitchStream } from "@/lib/qworld/types";

export function TwitchStreamsPoller() {
  // the only twitch poller on pages with a header (everything else only reads the cache)
  // pause while page is hidden, refresh immediately when visible again
  useTwitchStreams({ interval: 60_000, refetchOnFocus: true });
  return null;
}

export function AllStreams() {
  const streams = useTwitchStreams();

  return (
    <div className="app-links">
      <div>
        <Heading text="Streams" icon="twitch_glitch_purple" iconSize={20} />
      </div>
      {featuredFirst(streams).map((stream) => (
        <StreamListItem key={stream.id} stream={stream} />
      ))}
    </div>
  );
}

const StreamListItem = ({ stream }: { stream: TwitchStream }) => {
  const { viewer_count, title = "" } = stream;
  const maxLength = 60;

  return (
    <Fragment>
      <a href={streamUrl(stream)} className="inline-block ml-1.5" title={title}>
        {streamClientName(stream)}
        <span>
          ({viewer_count}){" "}
          {title && <span>- {title.substring(0, maxLength)}</span>}
        </span>
      </a>
      <br />
    </Fragment>
  );
};
