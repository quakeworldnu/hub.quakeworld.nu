import {
  faChartPie,
  faFloppyDisk,
  faHandPointer,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect } from "react";
import { useBoolean } from "usehooks-ts";
import { presets, Shortcuts } from "@/components/fte-player/shortcuts";
import { FteKtxStats } from "@/components/ktxstats/ktx-stats";
import { Scoreboard } from "@/components/scoreboard/game-scoreboard";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { btnSecondary, btnSuccess, sizeLarge } from "@/components/ui/theme";
import { Timestamp } from "@/components/ui/timestamp";
import { ClipControls } from "@/features/demo-player/clips/clip-controls";
import {
  ClipEditorProvider,
  useClipEditor,
} from "@/features/demo-player/clips/clip-editor";
import { EnableClipEditorButton } from "@/features/demo-player/clips/clips";
import { getDownloadUrl, getInfo } from "@/lib/cloudfront/demos";
import type { DemoInfo } from "@/lib/cloudfront/types";
import { useFteController } from "@/lib/fte/hooks";
import type { Game } from "@/lib/supabase/types";
import { FteDemoPlayer } from "./fte-demo-player";
import { ShareDemoButton } from "./share";

export const DemoPlayer = ({
  game,
  demo_sha256,
}: {
  game: Game;
  demo_sha256: string;
}) => {
  const { data: demo = null } = useQuery({
    queryKey: ["demoInfo", demo_sha256],
    queryFn: () => getInfo(demo_sha256),
  });
  const fte = useFteController();

  useEffect(() => {
    if (demo) {
      document.title = `${getDemoDescription(demo.filename)} - QuakeWorld Hub`;
    }
  }, [demo]);

  useEffect(() => {
    if (!fte || !demo) {
      return;
    }

    if ("ctf" === demo.mode) {
      fte.command("enemyskin", '""');
      fte.command("teamskin", '""');

      // engine player objects (setUserInfo)
      for (const p of fte.getClientState().getPlayers()) {
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

  const demoDescription = getDemoDescription(demo.filename);

  return (
    <div className="py-6">
      {showClipEditor && <ClipControls />}

      <div className={clsx({ hidden: showClipEditor })}>
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

        <ScoreboardAndStats game={game} />
        <hr className="my-6 border-slate-800" />

        <Shortcuts preset={presets.demoPlayer} />
      </div>
    </div>
  );
};

function ScoreboardAndStats({ game }: { game: Game }) {
  const { toggle: toggleSpoilers, value: showSpoilers } = useBoolean(false);

  return (
    <div className="my-6 flex flex-wrap items-stretch gap-x-8 gap-y-6">
      <div>
        <DemoScoreboard game={game} showScores={showSpoilers} />
        <button
          type="button"
          onClick={toggleSpoilers}
          className={clsx(btnSecondary, "py-1.5 px-2 text-xs mt-2", {
            hidden: showSpoilers,
          })}
        >
          Show scores / stats
        </button>
      </div>

      <div className="flex flex-col grow max-w-[40vw]">
        <div className="flex items-center text-sm font-bold mb-2 text-slate-300">
          <FontAwesomeIcon
            fixedWidth
            icon={faChartPie}
            className="mr-1.5 text-slate-400"
          />
          Stats
        </div>
        {showSpoilers && <FteKtxStats />}
        {!showSpoilers && (
          <div
            className="flex grow items-center justify-center bg-[#151525] hover:bg-slate-800 cursor-pointer border border-slate-800 text-muted-foreground text-sm transition-colors"
            onClick={toggleSpoilers}
          >
            <FontAwesomeIcon
              fixedWidth
              icon={faHandPointer}
              className="mr-1.5 text-slate-400"
            />
            Click to show scores/stats
          </div>
        )}
        <div className="h-10" />
      </div>
    </div>
  );
}

function formatDate(date: string | null): string {
  if (!date) {
    return "";
  }

  return date.substring(0, "YYYY-MM-DD HH:II".length).replace("T", " ");
}

const DemoScoreboard = ({
  game,
  showScores,
}: {
  game: Game;
  showScores: boolean;
}) => {
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
