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
              "font-bold text-purple-500": p.id === trackUserid,
            },
            "py-0.5 px-1.5 rounded transition-colors",
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
