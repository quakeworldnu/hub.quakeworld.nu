import { useUpdateInterval } from "@qwhub/pages/demo_player/DemoPlayer/fte/hooks";
import classNames from "classnames";
import { toColoredHtml } from "@qwhub/pages/demo_player/qwstrings";

export const Track = ({ players, onClick, getTrackUserid }) => {
  useUpdateInterval(200);

  if (!players) {
    return null;
  }

  const trackUserid = getTrackUserid();

  return (
    <div className="flex space-x-1 px-3 bg-black rounded-xl items-center">
      {players.map((p) => (
        <button
          className={classNames(
            {
              "bg-purple-600": p.id === trackUserid,
              "bg-black": p.id !== trackUserid,
            },
            "text-xs py-1 px-1.5 rounded transition-colors",
          )}
          key={p.name}
          onClick={() => onClick(p.id)}
        >
          <span dangerouslySetInnerHTML={{ __html: toColoredHtml(p.name) }} />
        </button>
      ))}
    </div>
  );
};
