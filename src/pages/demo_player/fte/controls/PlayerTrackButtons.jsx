import { useUpdateInterval } from "@qwhub/hooks";
import {
  useFteController,
  useFteUpdateOnEvent,
} from "@qwhub/pages/demo_player/fte/hooks";
import classNames from "classnames";
import { toColoredHtml } from "@qwhub/pages/demo_player/qwstrings";

export const PlayerTrackButtons = () => {
  useUpdateInterval(100);
  useFteUpdateOnEvent("track");
  const fte = useFteController();

  if (!fte) {
    return null;
  }
  const trackUserid = fte.getTrackUserid();

  return (
    <>
      {fte.getPlayers().map((p) => (
        <button
          className={classNames(
            {
              "text-pink-500 scale-125": p.id === trackUserid,
              "text-gray-300": p.id !== trackUserid,
            },
            "py-0.5 px-1.5 rounded transition-all text-xs",
          )}
          key={p.name}
          onClick={() => fte.track(p.id)}
        >
          <span dangerouslySetInnerHTML={{ __html: toColoredHtml(p.name) }} />
        </button>
      ))}
    </>
  );
};
