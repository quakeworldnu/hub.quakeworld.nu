import {
  faChartPie,
  faFloppyDisk,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// @ts-ignore
import { Scoreboard } from "@qwhub/pages/games/browser/Scoreboard";
import { QuakeTextFromByteString } from "@qwhub/pages/games/player/QuakeText";
import { useKtxstats } from "@qwhub/pages/games/player/ktxstats.ts";
import { Game } from "@qwhub/pages/games/services/supabase/supabase.types.ts";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useBoolean } from "usehooks-ts";
import { Timestamp } from "../Timestamp";
import { useFteController } from "../fte/hooks";
import { getDownloadUrl, getInfo } from "../services/cloudfront/cdemos";
import { DemoInfo } from "../services/cloudfront/types";
import { btnSecondary, btnSuccess, sizeLarge } from "../ui/theme";
import { ShareDemoButton } from "./Share";
import { Shortcuts, presets } from "./Shortcuts";
import { ClipControls } from "./clips/ClipControls";
import { EnableClipEditorButton } from "./clips/Clips";
import { ClipEditorProvider, useClipEditor } from "./clips/context";

import { FteDemoPlayer } from "@qwhub/pages/games/player/FteDemoPlayer";
import { KtxstatsV3 } from "@qwhub/pages/games/player/KtxstatsV3.ts";
// @ts-ignore
import { ColoredFrags } from "@qwhub/servers/ColoredFrags.jsx";

export const DemoPlayer = ({
  game,
  demo_sha256,
}: { game: Game; demo_sha256: string }) => {
  const [demo, setDemo] = useState<DemoInfo | null>(null);
  const fte = useFteController();

  useEffect(() => {
    async function init() {
      const demo = await getInfo(demo_sha256);
      setDemo(demo);

      if (demo) {
        document.title = `${getDemoDescription(demo.filename)} - QuakeWorld Hub`;
      }
    }

    init();
  }, []);

  useEffect(() => {
    if (!fte || !demo) {
      return;
    }

    if ("ctf" === demo.mode) {
      fte.command("enemyskin", '""');
      fte.command("teamskin", '""');

      for (const p of fte.getPlayers()) {
        p.setUserInfo("skin", `ctf_${p.getTeamPlain()}`);
      }
    }
  }, [fte]);

  if (!demo) {
    return <div>Loading...</div>;
  }

  return (
    <ClipEditorProvider>
      <div className="lg:flex min-h-[200px]">
        <div className="flex flex-col grow">
          <div className="flex grow bg-black items-center justify-center max-h-[75vh]">
            <FteDemoPlayer demo={demo} mapName={game.map} />
          </div>
          <DemoPlayerFooter game={game} demo={demo} />
        </div>
      </div>
    </ClipEditorProvider>
  );
};

function getDemoDescription(filename: string): string {
  return filename
    .substring("yyyymmdd-hhii ".length)
    .replace(/_/g, " ")
    .replace(".mvd", "")
    .replace("[", " [");
}

const DemoPlayerFooter = ({ game, demo }: { game: Game; demo: DemoInfo }) => {
  const { isEnabled: showClipEditor } = useClipEditor();
  const { setTrue: toggleSpoilers, value: showSpoilers } = useBoolean(false);
  const demoDescription = getDemoDescription(demo.filename);

  return (
    <div className="py-6">
      {showClipEditor && <ClipControls />}

      <div className={classNames({ hidden: showClipEditor })}>
        <div className="md:flex justify-between">
          <div className="space-y-2">
            <div className="text-2xl font-bold">{demoDescription}</div>
            <div className="text-slate-400 text-sm">
              {formatDate(demo.timestamp)} (
              <Timestamp timestamp={demo.timestamp} />) on{" "}
              {demo.server.hostname}
            </div>
          </div>
          <div className="flex flex-wrap items-start my-3 md:my-0 gap-3">
            <EnableClipEditorButton />
            <ShareDemoButton />
            <DownloadDemoButton s3_key={demo.sha256} />
          </div>
        </div>

        <div className="my-6 flex flex-wrap gap-x-8 gap-y-6">
          <div>
            <DemoScoreboard game={game} showScores={showSpoilers} />
            <button
              onClick={toggleSpoilers}
              className={classNames(btnSecondary, "py-1.5 px-2 text-xs mt-2", {
                hidden: showSpoilers,
              })}
            >
              Show scores / stats
            </button>
          </div>

          {showSpoilers && <DemoStats sha256={demo.sha256} />}
        </div>

        <hr className="my-6 border-slate-800" />

        <Shortcuts preset={presets.demoPlayer} />
      </div>
    </div>
  );
};

function formatDate(date: string | null): string {
  if (!date) {
    return "";
  }

  return date.substring(0, "YYYY-MM-DD HH:II".length).replace("T", " ");
}

const DemoStats = ({ sha256 }: { sha256: string }) => {
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
        {/*<pre>{JSON.stringify(stats, null, 2)}</pre>*/}
      </div>
    </div>
  );
};

const DemoStatsTable = ({
  stats,
}: { stats: KtxstatsV3 | null | undefined }) => {
  if (undefined === stats) {
    return <span className="text-sm text-slate-400">loading..</span>;
  } else if (null === stats) {
    return (
      <span className="text-sm text-slate-400">
        (no stats available/found in demo)
      </span>
    );
  }

  const isTeamplay = stats.tp > 0;
  const isCtf = "ctf" === stats.mode;
  const isTeamDeathmatch = "team" === stats.mode;

  const sortedPlayers = stats.players.sort((a, b) => {
    return b.stats.frags - a.stats.frags;
  });

  return (
    <table className="text-sm text-right">
      <thead>
        <tr className="text-xs text-slate-300">
          <th className="px-2 min-w-12">Frags</th>
          {isTeamplay && <th className="px-2 py-1.5 text-left">Team</th>}
          <th className="px-2 py-1.5 w-auto text-left">Name</th>
          {isCtf && (
            <>
              <th className="px-2 min-w-12">Caps</th>
              <th className="px-2 min-w-12">Defends</th>
              <th className="px-2 min-w-12">Returns</th>
            </>
          )}

          <th className="px-2 min-w-12">Eff</th>
          <th className="px-2 min-w-12">Kills</th>
          <th className="px-2 min-w-12">Deaths</th>
          <th className="px-2 min-w-8">Bores</th>
          {isTeamDeathmatch && <th className="px-2 min-w-12">TKs</th>}
          <th className="px-2 min-w-12">Given</th>
          <th className="px-2 min-w-12">Taken</th>
          <th className="px-2 min-w-8 text-[#0f0]">GA</th>
          <th className="px-2 min-w-8 text-[#ff0]">YA</th>
          <th className="px-2 min-w-8 text-[#f00]">RA</th>
          <th className="px-2 min-w-8 text-sky-300">MH</th>
          {!isCtf && (
            <>
              <th className="px-2 min-w-12">SG%</th>
              <th className="px-2 min-w-12">LG%</th>
            </>
          )}

          {isTeamplay && (
            <>
              <th className="px-2 min-w-12">
                LG (<abbr title="took">t</abbr> / <abbr title="killed">k</abbr>{" "}
                / <abbr title="dropped">d</abbr>)
              </th>
              <th className="px-2 min-w-12">
                RL (<abbr title="took">t</abbr> / <abbr title="killed">k</abbr>{" "}
                / <abbr title="dropped">d</abbr>)
              </th>
              <th className="px-2 min-w-6 text-[#39f]">Q</th>
              <th className="px-2 min-w-6 text-[#f00]">P</th>
              <th className="px-2 min-w-6 text-[#ff0]">R</th>
              {isCtf && (
                <>
                  <th className="px-2 min-w-6">Hst</th>
                  <th className="px-2 min-w-6">Reg</th>
                  <th className="px-2 min-w-6">Res</th>
                  <th className="px-2 min-w-6">Str</th>
                </>
              )}
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {sortedPlayers.map((p, index) => (
          <tr
            key={index}
            className="odd:bg-slate-950 hover:bg-slate-800 hover:font-bold"
          >
            <td className="px-2 app-text-outline">
              <ColoredFrags
                frags={p.stats.frags}
                colors={[p["top-color"], p["bottom-color"]]}
              />
            </td>
            {isTeamplay && (
              <td className="px-2 py-1.5 text-center">
                <QuakeTextFromByteString name={p.team} />
              </td>
            )}
            <td className="px-2 py-1.5 text-left">
              <QuakeTextFromByteString name={p.name} />
            </td>
            {isCtf && (
              <>
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
                100 * (p.stats.frags / (p.stats.frags + p.stats.deaths)),
              )}
              %
            </td>
            <td className="px-2">{p.stats.kills}</td>
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
                          (p.weapons.sg.acc.hits / p.weapons.sg.acc.attacks),
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
                          (p.weapons.lg.acc.hits / p.weapons.lg.acc.attacks),
                      )}
                      %
                    </span>
                  )}
                </td>
              </>
            )}

            {isTeamplay && (
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
                <td className="px-2">
                  <Num value={p.items.q.took} />
                </td>
                <td className="px-2">
                  <Num value={p.items.p.took} />
                </td>
                <td className="px-2">
                  <Num value={p.items.r.took} />
                </td>

                {isCtf &&
                  Object.values(p.ctf.runes).map((value, index) => (
                    <td key={index} className="px-2">
                      <Num value={value} />
                    </td>
                  ))}
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function Num({ value }: { value: number }) {
  return 0 === value ? <span className="text-slate-500">0</span> : value;
}

const DemoScoreboard = ({
  game,
  showScores,
}: { game: Game; showScores: boolean }) => {
  return (
    <div>
      <div className="flex items-center text-sm font-bold mb-2 text-slate-300">
        <FontAwesomeIcon
          fixedWidth
          icon={faTrophy}
          className="mr-1.5 text-slate-400"
        />
        Scoreboard
      </div>
      <div className="w-[340px] space-y-2">
        <Scoreboard game={game} showScores={showScores} />
      </div>
    </div>
  );
};

export const DownloadDemoButton = ({ s3_key }: { s3_key: string }) => {
  const demoUrl = getDownloadUrl(s3_key);

  return (
    <a href={demoUrl} className={`${btnSuccess} ${sizeLarge}`}>
      <FontAwesomeIcon icon={faFloppyDisk} fixedWidth className="mr-1.5" />
      Download
    </a>
  );
};
