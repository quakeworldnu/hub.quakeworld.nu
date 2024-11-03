import { faFloppyDisk, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// @ts-ignore
import { Scoreboard } from "@qwhub/pages/games/browser/Scoreboard";
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

import { DemoStats } from "@qwhub/pages/games/player/DemoStats.tsx";
import { FteDemoPlayer } from "@qwhub/pages/games/player/FteDemoPlayer";
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
