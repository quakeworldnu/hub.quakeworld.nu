import { Heading } from "@qwhub/Common";
import { useGetTwitchStreamsQuery } from "@qwhub/services/qworld/api";
import { isFeaturedStream, streamUrl } from "@qwhub/services/qworld/twitch";
import React, { Fragment } from "react";
import { TwitchButton } from "./Buttons";

export function FeaturedStreams() {
  const { data: streams = [] } = useGetTwitchStreamsQuery(null, {
    pollingInterval: 60_000,
  });

  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
      {streams.filter(isFeaturedStream).map((stream) => (
        <FeaturedStream key={stream.user_login} stream={stream} />
      ))}
    </div>
  );
}

const FeaturedStream = (props) => {
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
  const { data: streams = [] } = useGetTwitchStreamsQuery(null);

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

const StreamListItem = ({ stream }) => {
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
