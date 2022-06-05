import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TextBlur } from "../Animations/Text.jsx";
import { useGetStreamsQuery } from "../../services/qws.js";

export default function Streams() {
  const { data, error, isLoading } = useGetStreamsQuery(
    {},
    {
      pollingInterval: 15000, // ms
    }
  );

  const [parent] = useAutoAnimate();

  if (error || isLoading || 0 === data.length) {
    return <div ref={parent} />;
  }

  console.log("streams.render");

  return (
    <div className="columns is-multiline is-mobile mb-3" ref={parent}>
      {data.map((stream) => (
        <Stream key={stream.player} {...stream} />
      ))}
    </div>
  );
}

const Stream = React.memo((props) => {
  const { title, channel, viewers, url } = props;

  console.log("stream.render", channel);

  return (
    <div className="column is-narrow">
      <a className="button is-fullwidth is-dark p-3" href={url}>
        <img
          src={`/assets/img/icons/twitch_glitch_purple.svg`}
          width="16"
          height="16"
          className="mr-2"
        />

        <span className="mr-2">
          <strong>{channel}</strong>
        </span>

        <span className="app-dim-light" style={{ fontSize: "13px" }}>
          (<TextBlur key="viewers" value={viewers} /> viewers)
          <span className="ml-3 is-hidden-mobile">
            <TextBlur key="title" value={title} />
          </span>
        </span>
      </a>
    </div>
  );
});
