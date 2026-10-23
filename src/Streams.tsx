import { Heading } from "@qwhub/Common";
import { useTwitchStreams } from "@qwhub/services/qworld/queries.ts";
import { isFeaturedStream, streamUrl } from "@qwhub/services/qworld/twitch";
import type { TwitchStream } from "@qwhub/services/qworld/types.ts";
import { Fragment } from "react";
import { TwitchButton } from "./Buttons";

export function FeaturedStreams() {
  // the only twitch poller on pages with a header (server cards only read the cache)
  // pause while page is hidden, refresh immediately when visible again
  const streams = useTwitchStreams({ interval: 60_000, refetchOnFocus: true });

  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
      {streams.filter(isFeaturedStream).map((stream) => (
        <FeaturedStream key={stream.user_login} stream={stream} />
      ))}
    </div>
  );
}

const FeaturedStream = (props: { stream: TwitchStream }) => {
  const { stream } = props;

  return (
    <TwitchButton
      login={stream.user_login}
      channel={stream.user_name}
      title={stream.title}
      viewers={stream.viewer_count}
      className="block px-3 py-1.5 rounded-lg"
    />
  );
};

export function AllStreams() {
  const streams = useTwitchStreams();

  return (
    <div className="app-links">
      <div>
        <Heading text="Streams" icon="twitch_glitch_purple" iconSize={20} />
      </div>
      {streams.map((stream) => (
        <StreamListItem key={stream.id} stream={stream} />
      ))}
    </div>
  );
}

const StreamListItem = ({ stream }: { stream: TwitchStream }) => {
  const { user_name, viewer_count, title = "" } = stream;
  const maxLength = 60;

  return (
    <Fragment>
      <a href={streamUrl(stream)} className="inline-block ml-1.5" title={title}>
        {user_name}
        <span>
          ({viewer_count}){" "}
          {title && <span>- {title.substring(0, maxLength)}</span>}
        </span>
      </a>
      <br />
    </Fragment>
  );
};
