import { useUpdateInterval } from "../../hooks.ts";
import { useFteController, useFteUpdateOnEvent } from "../../fte/hooks.ts";
import classNames from "classnames";
import { toColoredHtml } from "../../qwstrings.ts";
import { PlayerInfo } from "../../fte/types.ts";

export const PlayerTrackButtons = () => {
  useUpdateInterval(100);
  useFteUpdateOnEvent("track");
  const fte = useFteController();

  if (!fte) {
    return null;
  }
  const trackUserid = fte.getTrackUserid();
  const showItems = fte.getGameElapsedTime() > 0;

  return (
    <>
      {fte.getPlayers().map((p: PlayerInfo) => (
        <button
          className={classNames(
            {
              "font-bold bg-black/50 rounded": p.id === trackUserid,
              "text-gray-300": p.id !== trackUserid,
            },
            "py-1 px-2 rounded transition-colors flex items-center text-xs 2xl:text-base focus:outline-none",
          )}
          key={p.name}
          onClick={() => fte.track(p.id)}
        >
          <span className="flex items-center space-x-0.5">
            <span
              className="whitespace-nowrap mr-2"
              dangerouslySetInnerHTML={{ __html: toColoredHtml(p.name) }}
            />
            {showItems && (
              <>
                {p.items.quad && (
                  <span className="text-blue-500 app-effect-fade-in">q</span>
                )}
                {p.items.ring && <span className="text-yellow-300">r</span>}
                {p.items.pent && (
                  <span className="text-red-600 app-effect-fade-in">p</span>
                )}
                {p.items.rl && (
                  <span className="text-amber-400 app-effect-fade-in">rl</span>
                )}
                {p.items.lg && (
                  <span className="text-cyan-400 app-effect-fade-in">lg</span>
                )}
              </>
            )}
          </span>
          <div className="text-xs text-left hidden">
            <br />
            <pre>{JSON.stringify(p, null, 2)}</pre>
          </div>
        </button>
      ))}
    </>
  );
};
