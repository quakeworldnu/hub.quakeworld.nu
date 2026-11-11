import { Fragment } from "react";
import { Heading } from "@/components/ui/heading";
import { useTwitchStreams } from "@/lib/qworld/queries";
import {
  featuredFirst,
  isHighlightedStream,
  streamClientName,
  streamUrl,
} from "@/lib/qworld/twitch";
import type { TwitchStream } from "@/lib/qworld/types";
import { getFlagUrl } from "@/utils/flags";

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

  if (isHighlightedStream(stream)) {
    return (
      <Fragment>
        <a
          href={streamUrl(stream)}
          className="block my-1 px-2 py-1.5 rounded border border-red-500/60 bg-linear-to-r from-red-900/50 to-slate-800/50 text-white! hover:border-red-400"
          title={title}
        >
          <div className="flex items-center gap-1.5">
            <img src={getFlagUrl("pl")} alt="PL" className="h-3 w-auto" />
            <strong>{streamClientName(stream)}</strong>
            <span>({viewer_count})</span>
            <span className="ml-auto px-1 rounded bg-red-600 text-white! font-bold text-[10px] uppercase">
              Radomsko
            </span>
          </div>
          {title && (
            <div className="text-xs text-gray-300 mt-0.5 truncate">
              {title.substring(0, maxLength)}
            </div>
          )}
        </a>
      </Fragment>
    );
  }

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
