import { getAssetUrl } from "@qwhub/pages/games/services/cloudfront/cassets.ts";

import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Player } from "@qwhub/pages/games/player/KtxstatsV3.ts";
import {
  KtxstatsV3E,
  TeamStats,
} from "@qwhub/pages/games/player/KtxstatsV3Enchanced.ts";
import { QuakeTextFromByteString } from "@qwhub/pages/games/player/QuakeText.tsx";
import { useKtxstats } from "@qwhub/pages/games/player/ktxstats.ts";
// @ts-ignore
import { ColoredFrags } from "@qwhub/servers/ColoredFrags";
import { Fragment } from "react";

export const DemoStats = ({ sha256 }: { sha256: string }) => {
  const stats = useKtxstats(sha256);

  return (
    <div>
      <div className="flex items-center text-sm font-bold mb-2 text-slate-300">
        <FontAwesomeIcon
          fixedWidth
          icon={faChartPie}
          className="mr-1.5 text-slate-400"
        />
        Stats
      </div>
      <div>
        <DemoStatsTable stats={stats} />
      </div>
    </div>
  );
};
export const DemoStatsTable = ({
  stats,
}: { stats: KtxstatsV3E | null | undefined }) => {
  if (undefined === stats) {
    return <span className="text-sm text-slate-400">loading..</span>;
  } else if (null === stats) {
    return (
      <span className="text-sm text-slate-400">
        (no stats available/found in demo)
      </span>
    );
  }

  const isTeamplay = stats.teamsStats.length > 0;
  const isCtf = "ctf" === stats.mode;
  const isTeamDeathmatch = "team" === stats.mode && isTeamplay;
  const participants: Array<TeamStats | Player> = [
    ...stats.teamsStats,
    ...stats.players,
  ];

  return (
    <div>
      <table className="text-sm text-right">
        <thead>
          <tr className="text-xs text-slate-300">
            <th className="px-2 min-w-12">Frags</th>
            {isTeamplay && <th className="px-2 py-1 text-left">Team</th>}
            <th className="px-2 py-1 w-auto text-left">Name</th>
            {isCtf && (
              <>
                <th className="px-2 min-w-12">Picks</th>
                <th className="px-2 min-w-12">Caps</th>
                <th className="px-2 min-w-12">Defends</th>
                <th className="px-2 min-w-12">Returns</th>
              </>
            )}

            <th className="px-2 min-w-12">Eff</th>
            <th className="px-2 min-w-12">Kills</th>
            {!isTeamplay && (
              <th className="px-2 min-w-12">
                <abbr title="Spawnfrags">S.Frags</abbr>
              </th>
            )}
            <th className="px-2 min-w-12">Deaths</th>

            <th className="px-2 min-w-8">Bores</th>
            {isTeamDeathmatch && <th className="px-2 min-w-12">TKs</th>}
            <th className="px-2 min-w-12">Given</th>
            <th className="px-2 min-w-12">Taken</th>

            {isTeamDeathmatch && (
              <th className="px-2 min-w-12">
                <abbr title="Damage dealth to enemy weapons">EWEP</abbr>
              </th>
            )}

            {!isCtf && (
              <th className="px-2 min-w-12">
                <abbr
                  title="Average damage taken per death"
                  className="whitespace-nowrap"
                >
                  To Die
                </abbr>
              </th>
            )}

            <th className="px-2 min-w-8 text-[#0f0]">GA</th>
            <th className="px-2 min-w-8 text-[#ff0]">YA</th>
            <th className="px-2 min-w-8 text-[#f00]">RA</th>
            <th className="px-2 min-w-8 text-sky-300">MH</th>

            {!isCtf && (
              <>
                <th className="px-2 min-w-10">SG%</th>
                <th className="px-2 min-w-10">LG%</th>
              </>
            )}

            {!isCtf && (
              <th className="px-2 min-w-6">
                <abbr title="Direct hits">RL#</abbr>
              </th>
            )}

            {isTeamDeathmatch && (
              <>
                <th className="px-2 min-w-12">
                  LG (<abbr title="took">t</abbr> /{" "}
                  <abbr title="killed">k</abbr> / <abbr title="dropped">d</abbr>
                  )
                </th>
                <th className="px-2 min-w-12">
                  RL (<abbr title="took">t</abbr> /{" "}
                  <abbr title="killed">k</abbr> / <abbr title="dropped">d</abbr>
                  )
                </th>
              </>
            )}

            {isTeamplay && (
              <>
                <th className="px-2 min-w-6 text-[#39f]">Q</th>
                <th className="px-2 min-w-6 text-[#f00]">P</th>
                {!isCtf && <th className="px-2 min-w-6 text-[#ff0]">R</th>}
              </>
            )}

            {isCtf && (
              <>
                <th className="px-2">
                  <Rune number={1} title="Resistance" />
                </th>
                <th className="px-2 min-w-6">
                  <Rune number={2} title="Strength" />
                </th>
                <th className="px-2 min-w-6">
                  <Rune number={3} title="Haste" />
                </th>
                <th className="px-2 min-w-6">
                  <Rune number={4} title="Regeneration" />
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {participants.map((p, index) => (
            <Fragment key={`row-${index}`}>
              {isTeamplay && index === stats.teamsStats.length && (
                <>
                  <tr>
                    <td colSpan={999} className="h-3.5" />
                  </tr>
                  <tr>
                    <td colSpan={999} className="h-0" />
                  </tr>
                </>
              )}
              <tr key={index} className="odd:bg-slate-800 hover:bg-sky-900">
                <td className="px-2 py-0.5 app-text-outline">
                  <ColoredFrags
                    frags={p.stats.frags}
                    colors={[p["top-color"], p["bottom-color"]]}
                  />
                </td>
                {isTeamplay && (
                  <td className="px-2 text-center">
                    <QuakeTextFromByteString name={p.team} />
                  </td>
                )}
                <td className="px-2 text-left whitespace-nowrap">
                  <QuakeTextFromByteString name={p.name} />
                </td>
                {isCtf && (
                  <>
                    <td className="px-2">
                      <Num value={p.ctf.pickups} />
                    </td>
                    <td className="px-2">
                      <Num value={p.ctf.caps} />
                    </td>
                    <td className="px-2">
                      <Num value={p.ctf.defends} />
                    </td>
                    <td className="px-2">
                      <Num value={p.ctf.returns} />
                    </td>
                  </>
                )}
                <td className="px-2">
                  {Math.round(
                    100 * (p.stats.kills / (p.stats.kills + p.stats.deaths)),
                  )}
                  %
                </td>
                <td className="px-2">{p.stats.kills}</td>

                {!isTeamplay && (
                  <td className="px-2">
                    <Num value={p.stats["spawn-frags"]} />
                  </td>
                )}

                <td className="px-2">{p.stats.deaths}</td>
                <td className="px-2">
                  <Num value={p.stats.suicides} />
                </td>

                {isTeamDeathmatch && (
                  <td className="px-2">
                    <Num value={p.stats.tk} />
                  </td>
                )}

                <td className="px-2">{p.dmg.given}</td>
                <td className="px-2">{p.dmg.taken}</td>

                {isTeamDeathmatch && (
                  <td className="px-2">{p.dmg["enemy-weapons"]}</td>
                )}

                {!isCtf && <td className="px-2">{p.dmg["taken-to-die"]}</td>}

                <td className="px-2 text-green-200">
                  <Num value={p.items.ga.took} />
                </td>
                <td className="px-2 text-yellow-200">
                  <Num value={p.items.ya.took} />
                </td>
                <td className="px-2 text-red-200">
                  <Num value={p.items.ra.took} />
                </td>
                <td className="px-2 text-sky-200">
                  <Num value={p.items.health_100.took} />
                </td>
                {!isCtf && (
                  <>
                    <td className="px-2">
                      {p.weapons.sg.acc.attacks > 0 && (
                        <span>
                          {Math.round(
                            100 *
                              (p.weapons.sg.acc.hits /
                                p.weapons.sg.acc.attacks),
                          )}
                          %
                        </span>
                      )}
                    </td>
                    <td className="px-2">
                      {p.weapons.lg.acc.attacks > 0 && (
                        <span>
                          {Math.round(
                            100 *
                              (p.weapons.lg.acc.hits /
                                p.weapons.lg.acc.attacks),
                          )}
                          %
                        </span>
                      )}
                    </td>
                  </>
                )}

                {!isCtf && (
                  <td className="px-2">
                    <Num value={p.weapons.rl.acc.hits} />
                  </td>
                )}

                {isTeamDeathmatch && (
                  <>
                    <td className="px-2">
                      {p.weapons.lg && (
                        <div className="flex gap-x-2">
                          <span className="w-5">
                            <Num value={p.weapons.lg.pickups.taken} />
                          </span>
                          <span className="w-5 text-green-200">
                            <Num value={p.weapons.lg.kills.enemy} />
                          </span>
                          <span className="w-5 text-red-200">
                            <Num value={p.weapons.lg.pickups.dropped} />
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-2">
                      {p.weapons.rl && (
                        <div className="flex gap-x-2">
                          <span className="w-5">
                            <Num value={p.weapons.rl.pickups.taken} />
                          </span>
                          <span className="w-5 text-green-200">
                            <Num value={p.weapons.rl.kills.enemy} />
                          </span>
                          <span className="w-5 text-red-200">
                            <Num value={p.weapons.rl.pickups.dropped} />
                          </span>
                        </div>
                      )}
                    </td>
                  </>
                )}

                {isTeamplay && (
                  <>
                    <td className="px-2">
                      <Num value={p.items.q.took} />
                    </td>
                    <td className="px-2">
                      <Num value={p.items.p.took} />
                    </td>
                    {!isCtf && (
                      <td className="px-2">
                        <Num value={p.items.r.took} />
                      </td>
                    )}
                  </>
                )}

                {isCtf &&
                  Object.values(p.ctf.runes).map((value, index) => (
                    <td key={index} className="px-2">
                      <Num
                        value={Math.round(100 * (value / stats.duration))}
                        suffix="%"
                      />
                    </td>
                  ))}
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Rune = ({ number, title }: { number: number; title: string }) => {
  return (
    <img
      src={getAssetUrl(`fte/id1/gfx/sb_sigil${number}.png`)}
      alt={title}
      className="mx-auto"
      width={10}
    />
  );
};

const Num = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  return 0 === value ? (
    <span className="text-slate-500">0</span>
  ) : (
    `${value}${suffix}`
  );
};
