import { useUpdateInterval } from "../../hooks.ts";
import { useFteController, useFteUpdateOnEvent } from "../../fte/hooks.ts";
import classNames from "classnames";
import { toColoredHtml } from "../../qwstrings.ts";
import { ItemsInfo, PlayerInfo, TeamInfo } from "../../fte/types.ts";

export const Teaminfo = ({ showTeams }: { showTeams: boolean }) => {
  useUpdateInterval(100);
  useFteUpdateOnEvent("track");
  const fte = useFteController();

  if (!fte) {
    return null;
  }
  const trackUserid = fte.getTrackUserid();
  const gameHasStarted = fte.getGameElapsedTime() > 0;

  let teams: TeamInfo[];

  if (showTeams) {
    teams = fte.getTeams();
  } else {
    teams = fte.getPlayers().map((p: PlayerInfo) => ({
      name: p.name,
      frags: p.frags,
      players: [p],
    }));
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 items-center select-none">
      {teams.map((t: TeamInfo) => (
        <div key={t.name} className="text-xs 2xl:text-base">
          {showTeams && (
            <div className="flex items-center justify-between text-sm mb-1 px-2 py-1 border-b-2 border-b-black">
              <div
                className="font-bold"
                dangerouslySetInnerHTML={{ __html: toColoredHtml(t.name) }}
              ></div>
              {gameHasStarted && (
                <div className="font-mono text-sm">{t.frags}</div>
              )}
            </div>
          )}
          <div>
            {t.players.map((p: PlayerInfo) => (
              <button
                className={classNames(
                  {
                    "font-bold bg-black/50 rounded": p.id === trackUserid,
                    "text-gray-300": p.id !== trackUserid,
                  },
                  "flex w-full items-center py-1 px-2 rounded transition-colors focus:outline-none",
                )}
                key={p.name}
                onClick={() => fte.track(p.id)}
              >
                <div className="flex w-full items-center space-x-2">
                  <div className="whitespace-nowrap grow text-left">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: toColoredHtml(p.name.substring(0, 15)),
                      }}
                    />
                    {gameHasStarted && <PlayerItems items={p.items} />}
                  </div>

                  {gameHasStarted && (
                    <div className="w-8 text-right font-mono text-sm">
                      {p.frags}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const PlayerItems = ({ items }: { items: ItemsInfo }) => {
  return (
    <span className="pl-2 space-x-1">
      {items.quad && (
        <span className="text-blue-500 app-effect-fade-in">q</span>
      )}
      {items.ring && (
        <span className="text-yellow-300 app-effect-fade-in">r</span>
      )}
      {items.pent && <span className="text-red-600 app-effect-fade-in">p</span>}
      {items.rl && (
        <span className="text-amber-400 app-effect-fade-in">rl</span>
      )}
      {items.lg && <span className="text-cyan-400 app-effect-fade-in">lg</span>}
    </span>
  );
};
