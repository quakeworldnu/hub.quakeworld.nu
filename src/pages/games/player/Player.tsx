import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Timestamp } from "../Timestamp.tsx";
import {
  getDemoDescription,
  getDemoDownloadUrl,
} from "../services/supabase/demo.ts";
import { getDemo } from "../services/supabase/supabase";
import type { Demo } from "../services/supabase/supabase.types.ts";
import { btnSecondary, btnSuccess, sizeLarge } from "../ui/theme.ts";
import { ShareDemoButton } from "./Share.tsx";
import { Shortcuts } from "./Shortcuts.tsx";
import { ClipControls } from "./clips/ClipControls.tsx";
import { EnableClipEditorButton } from "./clips/Clips.tsx";
import { ClipEditorProvider, useClipEditor } from "./clips/context.tsx";

import classNames from "classnames";
import { useBoolean, useEffectOnce } from "usehooks-ts";
import { Scoreboard } from "../browser/Scoreboard.tsx";
import { getAssets } from "../fte/assets.ts";
import { useFteController } from "../fte/hooks.ts";
import { KtxstatsV3, toKtxstatsV3 } from "./KtxstatsV3.ts";
import { toColoredHtml } from "../qwstrings.ts";

export const Player = ({ demoId }: { demoId: number }) => {
  const [demo, setDemo] = useState<Demo | null>(null);
  const fte = useFteController();

  useEffect(() => {
    if (!demoId) {
      return;
    }

    async function run() {
      const { data } = await getDemo(demoId);
      setDemo(data);
    }

    run();
  }, [demoId]);

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

  const demoUrl = getDemoDownloadUrl(demo.s3_key);
  const assets = getAssets(demoUrl, demo.map);

  return (
    <ClipEditorProvider>
      <div className="lg:flex min-h-[200px]">
        <div className="flex flex-col grow">
          <div className="flex grow bg-black items-center justify-center max-h-[75vh]">
            {/*<FtePlayer demo={demo} assets={assets} />*/}
          </div>
          <DemoPlayerFooter demo={demo} />
        </div>
      </div>
    </ClipEditorProvider>
  );
};

export const DemoPlayerFooter = ({ demo }: { demo: Demo }) => {
  const { isEnabled: showClipEditor } = useClipEditor();
  const demoDescription = getDemoDescription(demo);

  useEffect(() => {
    document.title = `${demoDescription} - QuakeWorld Hub`;
  });

  return (
    <div className="py-6">
      {showClipEditor ? (
        <ClipControls />
      ) : (
        <div>
          <div className="md:flex justify-between">
            <div className="space-y-2">
              <div className="text-2xl font-bold">{demoDescription}</div>
              <div className="text-slate-400 text-sm">
                <Timestamp timestamp={demo.timestamp} /> on {demo.source}
              </div>
            </div>
            <div className="flex flex-wrap items-start my-3 md:my-0 gap-3">
              <EnableClipEditorButton />
              <ShareDemoButton />
              <DownloadDemoButton s3_key={demo.s3_key} />
            </div>
          </div>

          <div className="my-6 flex space-x-24">
            <Result demo={demo} />
            <Ktxstats sha256={demo.sha256} />
          </div>

          <hr className="my-6 border-slate-800" />

          <Shortcuts />
        </div>
      )}
    </div>
  );
};

async function getKtxstatsBySha256(sha256: string): Promise<null | KtxstatsV3> {
  const CLOUDFRONT_URL = "https://d.quake.world";
  try {
    const res = await fetch(
      `${CLOUDFRONT_URL}/${sha256_to_s3_key(sha256)}.mvd.ktxstats.json`,
    );
    if (res.ok) {
      const stats = await res.text();
      return toKtxstatsV3(stats);
    }
  } catch (e) {
    console.log(e);
  }

  return null;
}

export function sha256_to_s3_key(sha256: string): string {
  return sha256.substring(0, 3) + "/" + sha256;
}

const Ktxstats = ({ sha256 }: { sha256: str }) => {
  const [stats, setStats] = useState<KtxstatsV3 | null>(null);

  useEffectOnce(() => {
    async function getAndSetStats() {
      setStats(await getKtxstatsBySha256(sha256));
    }

    getAndSetStats();
  });

  if (!stats) {
    return <div>NO STATS FOR U!</div>;
  }

  return (
    <div>
      <div className="font-bold text-slate-400 mb-2">Statistics</div>
      <div className="flex space-x-8">
        {stats.players.map((p) => (
          <div>
            <div
              className="font-bold"
              dangerouslySetInnerHTML={{ __html: toColoredHtml(p.name) }}
            />
            <div>{p.stats.frags}</div>
            <div>{p.stats.deaths}</div>
            <div>{p.stats.suicides}</div>
            <div>{p.stats.tk}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Result = ({ demo }: { demo: Demo }) => {
  const { setTrue: handleShowscoresClick, value: showScores } =
    useBoolean(false);

  return (
    <div>
      <div className="font-bold text-slate-400 mb-2">Scoreboard</div>
      <div className="w-[340px] space-y-2">
        <Scoreboard demo={demo} showScores={showScores} />
        <button
          onClick={handleShowscoresClick}
          className={classNames(btnSecondary, "py-1.5 px-2 text-sm")}
          disabled={showScores}
        >
          Show scores
        </button>
      </div>
    </div>
  );
};

export const DownloadDemoButton = ({ s3_key }: { s3_key: string }) => {
  const demoUrl = getDemoDownloadUrl(s3_key);

  return (
    <a href={demoUrl} className={`${btnSuccess} ${sizeLarge}`}>
      <FontAwesomeIcon icon={faFloppyDisk} fixedWidth className="mr-1.5" />
      Download
    </a>
  );
};
