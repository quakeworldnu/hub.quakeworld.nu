import classNames from "classnames";
import { useFteController, useFteUpdateOnEvent } from "../../fte/hooks.ts";
import type { Player, Team } from "../../fte/types.ts";
import { useUpdateInterval } from "../../hooks.ts";
import { QuakeTextFromBytes } from "../QuakeText.tsx";

export const ResponsivePlayerInfo = ({ scale }: { scale: number }) => {
  return (
    <div
      className={classNames(
        "absolute origin-bottom-right right-[1%] bottom-[72px] md:bottom-[96px]",
      )}
      style={{ transform: `scale(${scale})` }}
    >
      <PlayerInfo />
    </div>
  );
};

export const PlayerInfo = () => {
  useUpdateInterval(100);
  useFteUpdateOnEvent("track");
  const fte = useFteController();

  if (!fte) {
    return null;
  }
  const trackUserid = fte.getTrackUserid();
  // const gameHasStarted = fte.getGameElapsedTime() > 0;

  let teams: Team[];
  const state = fte.getClientState();
  const showTeams = state.teamplay > 0;

  if (showTeams) {
    teams = fte.getTeams();
  } else {
    teams = fte.getPlayers().map((p: Player) => ({
      name: p.getName(),
      namePlain: p.getNamePlain(),
      frags: p.frags,
      players: [p],
      topcolor: p.topcolor,
      bottomcolor: p.bottomcolor,
    }));
  }

  const c = fte.module;

  return (
    <div className="select-none font-bold">
      {teams.map((team: Team) => (
        <div key={team.namePlain} className="mt-4 first:mt-0">
          {showTeams && (
            <div className="flex justify-end mb-1 mr-0.5">
              <div
                className={`px-1.5 text-center app-text-shadow rounded text-sm qw-bgcolor-${team.topcolor}-${team.bottomcolor}`}
              >
                <QuakeTextFromBytes name={team.name} />: {team.frags}
              </div>
            </div>
          )}
          <div>
            {team.players.map((player: Player) => {
              const stats = player.getStats();
              const items = stats[c.STAT_ITEMS];
              const isAlive = stats[c.STAT_HEALTH] > 0;

              return (
                <button
                  className={classNames(
                    {
                      "bg-black/50 rounded": player.userid === trackUserid,
                      "text-gray-300": player.userid !== trackUserid,
                    },
                    "grid app-playerinfo-grid w-full gap-1 transition-colors focus:outline-none text-sm",
                  )}
                  key={player.userid}
                  onClick={() => fte.track(player.userid)}
                >
                  <div className="app-effect-fade-in-children">
                    <Powerups
                      hasPent={(items & c.IT_INVULNERABILITY) !== 0}
                      hasQuad={(items & c.IT_QUAD) !== 0}
                      hasRing={(items & c.IT_INVISIBILITY) !== 0}
                    />
                  </div>
                  <div className="whitespace-nowrap grow text-left">
                    <QuakeTextFromBytes name={player.getName()} />
                  </div>
                  <div>
                    <span className="qw-color-b">[</span>
                    <span className="inline-block w-11">
                      {player.getLocation().substring(0, 5)}
                    </span>
                    <span className="qw-color-b">]</span>
                  </div>
                  <div className="flex content-around justify-end">
                    {isAlive && (
                      <>
                        <div className="text-right">
                          <Armor
                            value={stats[c.STAT_ARMOR]}
                            isGreen={(items & c.IT_ARMOR1) !== 0}
                            isYellow={(items & c.IT_ARMOR2) !== 0}
                            isRed={(items & c.IT_ARMOR3) !== 0}
                          />
                        </div>
                        <div className="mx-0.5">/</div>
                        <div className="text-left w-6">
                          <Health value={stats[c.STAT_HEALTH]} />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="uppercase app-effect-fade-in-children">
                    <BestWeapon
                      hasSsg={(items & c.IT_SUPER_SHOTGUN) !== 0}
                      hasSng={(items & c.IT_SUPER_NAILGUN) !== 0}
                      hasGl={(items & c.IT_GRENADE_LAUNCHER) !== 0}
                      hasRl={(items & c.IT_ROCKET_LAUNCHER) !== 0}
                      hasLg={(items & c.IT_LIGHTNING) !== 0}
                    />
                  </div>
                  <div>{player.frags}</div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const Powerups = ({
  hasPent,
  hasQuad,
  hasRing,
}: {
  hasPent: boolean;
  hasQuad: boolean;
  hasRing: boolean;
}) => {
  return (
    <div className="flex space-x-1 px-1">
      {hasQuad && <span className="text-[#69f]">Q</span>}
      {hasPent && <span className="text-[#f00]">P</span>}
      {hasRing && <span className="text-[#ff0]">R</span>}
    </div>
  );
};

const BestWeapon = ({
  hasSsg,
  hasSng,
  hasGl,
  hasRl,
  hasLg,
}: {
  hasSsg: boolean;
  hasSng: boolean;
  hasGl: boolean;
  hasRl: boolean;
  hasLg: boolean;
}) => {
  if (hasRl || hasLg) {
    return (
      <>
        {hasRl && <span className="text-amber-500">rl</span>}
        <span className="text-cyan-400">{!hasRl && "l"}g</span>
      </>
    );
  } else if (hasGl) {
    return <span>gl</span>;
  } else if (hasSng) {
    return <span className="text-gray-400">sng</span>;
  } else if (hasSsg) {
    return <span className="text-gray-400">ssg</span>;
  }
  return "";
};

export const Armor = ({
  value,
  isGreen,
  isYellow,
  isRed,
}: {
  value: number;
  isGreen: boolean;
  isYellow: boolean;
  isRed: boolean;
}) => {
  return (
    <span
      className={classNames({
        "text-gray-400 font-normal": value === 0,
        "text-green-500": isGreen,
        "text-[#ff0]": isYellow,
        "text-[#f00]": isRed,
      })}
    >
      {value}
    </span>
  );
};

export const Health = ({ value }: { value: number }) => {
  return (
    <span
      className={classNames({
        "text-[#b00]": value < 25,
      })}
    >
      {value}
    </span>
  );
};
