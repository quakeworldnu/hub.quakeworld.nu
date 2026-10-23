import { Fragment } from "react";
import { Heading } from "@/components/ui/heading";
import { useTwitchStreams } from "@/lib/qworld/queries";
import { isFeaturedStream, streamUrl } from "@/lib/qworld/twitch";
import type { TwitchStream } from "@/lib/qworld/types";
import { TwitchButton } from "./twitch-button";

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
