import { Heading } from "@qwhub/Common";
import { useGetStreamsQuery } from "@qwhub/services/hub/hub";
import React, { Fragment } from "react";
import { TwitchButton } from "./Buttons";

export function FeaturedStreams() {
  const { data: streams = [] } = useGetStreamsQuery(null, {
    pollingInterval: 15500,
  });

  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
      {streams
        .filter((s) => s.is_featured)
        .map((stream) => (
          <FeaturedStream key={stream.channel} stream={stream} />
        ))}
    </div>
  );
}

const FeaturedStream = (props) => {
  const { stream } = props;

  return <TwitchButton {...stream} className="block px-3 py-1.5 rounded-lg" />;
};

export function AllStreams() {
  const { data: streams = [] } = useGetStreamsQuery(null);

  return (
    <div className="app-links my-8">
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
  const { channel, url, viewers, title = "" } = stream;
  const maxLength = 60;

  return (
    <Fragment>
      <a href={url} className="inline-block ml-1.5" title={title}>
        {channel}
        <span>
          ({viewers}) {title && <span>- {title.substring(0, maxLength)}</span>}
        </span>
      </a>
      <br />
    </Fragment>
  );
};
