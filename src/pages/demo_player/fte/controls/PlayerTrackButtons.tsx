import { useUpdateInterval } from "../../hooks.ts";
import { useFteController, useFteUpdateOnEvent } from "../hooks.ts";
import classNames from "classnames";
import { toColoredHtml } from "../../qwstrings.ts";
import { PlayerInfo } from "../types.ts";

export const PlayerTrackButtons = () => {
  useUpdateInterval(100);
  useFteUpdateOnEvent("track");
  const fte = useFteController();

  if (!fte) {
    return null;
  }
  const trackUserid = fte.getTrackUserid();
  const showWeapons = fte.getGameElapsedTime() > 0;

  return (
    <>
      {fte
        .getPlayers()
        .slice(0, 8)
        .map((p: PlayerInfo) => (
          <button
            className={classNames(
              {
                "font-bold scale-125": p.id === trackUserid,
                "text-gray-300": p.id !== trackUserid,
              },
              "py-0.5 px-2 rounded transition-all text-xs flex items-center",
            )}
            key={p.name}
            onClick={() => fte.track(p.id)}
          >
            <span className="flex items-center space-x-0.5">
              <span
                dangerouslySetInnerHTML={{ __html: toColoredHtml(p.name) }}
              />
              {showWeapons && (
                <>
                  {p.items.quad && (
                    <span className="text-blue-500 app-effect-fade-in">q</span>
                  )}
                  {p.items.ring && <span className="text-yellow-300">r</span>}
                  {p.items.pent && (
                    <span className="text-red-600 app-effect-fade-in">p</span>
                  )}
                  {p.items.rl && (
                    <span className="text-amber-400 app-effect-fade-in">
                      rl
                    </span>
                  )}
                  {p.items.lg && (
                    <span className="text-cyan-400 app-effect-fade-in">lg</span>
                  )}
                </>
              )}
            </span>
            <br />
            <div className="text-xs text-left hidden">
              <pre>{JSON.stringify(p, null, 2)}</pre>
            </div>
          </button>
        ))}
    </>
  );
};
