import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Timestamp } from "../Timestamp.tsx";
import { useFteController } from "../fte/hooks.ts";
import { getDownloadUrl, getInfo } from "../services/cloudfront/cdemos.ts";
import { DemoInfo } from "../services/cloudfront/types.ts";
import { btnSuccess, sizeLarge } from "../ui/theme.ts";
import { FteDemoPlayer } from "./FteDemoPlayer.tsx";
import { ShareDemoButton } from "./Share.tsx";
import { presets, Shortcuts } from "./Shortcuts.tsx";
import { ClipControls } from "./clips/ClipControls.tsx";
import { EnableClipEditorButton } from "./clips/Clips.tsx";
import { ClipEditorProvider, useClipEditor } from "./clips/context.tsx";

export const DemoPlayer = ({ sha256 }: { sha256: string }) => {
  const [demo, setDemo] = useState<DemoInfo | null>(null);
  const fte = useFteController();

  useEffect(() => {
    async function init() {
      setDemo(await getInfo(sha256));
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
            <FteDemoPlayer demo={demo} mapName={demo.map} />
          </div>
          <DemoPlayerFooter info={demo} />
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

const DemoPlayerFooter = ({ info }: { info: DemoInfo }) => {
  const { isEnabled: showClipEditor } = useClipEditor();
  const demoDescription = getDemoDescription(info.filename);

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
                {formatDate(info.timestamp)} (
                <Timestamp timestamp={info.timestamp} />) on{" "}
                {info.server.hostname}
              </div>
            </div>
            <div className="flex flex-wrap items-start my-3 md:my-0 gap-3">
              <EnableClipEditorButton />
              <ShareDemoButton />
              <DownloadDemoButton s3_key={info.sha256} />
            </div>
          </div>

          <div className="my-6">{/*<Result game={info} />*/}</div>

          <hr className="my-6 border-slate-800" />

          <Shortcuts preset={presets.demoPlayer} />
        </div>
      )}
    </div>
  );
};

function formatDate(date: string | null): string {
  if (!date) {
    return "";
  }

  return date.substring(0, "YYYY-MM-DD HH:II".length).replace("T", " ");
}

// const Result = ({ game }: { game: Game }) => {
//   const { setTrue: handleShowscoresClick, value: showScores } =
//     useBoolean(false);
//
//   return (
//     <div>
//       <div className="font-bold text-slate-400 mb-2">Scoreboard</div>
//       <div className="w-[340px] space-y-2">
//         <Scoreboard game={game} showScores={showScores} />
//         <button
//           onClick={handleShowscoresClick}
//           className={classNames(btnSecondary, "py-1.5 px-2 text-sm")}
//           disabled={showScores}
//         >
//           Show scores
//         </button>
//       </div>
//     </div>
//   );
// };

export const DownloadDemoButton = ({ s3_key }: { s3_key: string }) => {
  const demoUrl = getDownloadUrl(s3_key);

  return (
    <a href={demoUrl} className={`${btnSuccess} ${sizeLarge}`}>
      <FontAwesomeIcon icon={faFloppyDisk} fixedWidth className="mr-1.5" />
      Download
    </a>
  );
};
