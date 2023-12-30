import { useEffect, useState } from "react";
import { getDemo } from "../services/supabase/supabase";
import { Timestamp } from "../Timestamp.tsx";
import { Demo } from "../services/supabase/supabase.types.ts";
import {
  getDemoDescription,
  getDemoDownloadUrl,
} from "../services/supabase/demo.ts";
import { FtePlayer } from "./FtePlayer.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { EnableClipEditorButton } from "./clips/Clips.tsx";
import { ClipControls } from "./clips/ClipControls.tsx";
import { ClipEditorProvider, useClipEditor } from "./clips/context.tsx";
import { ShareDemoButton } from "./Share.tsx";
import { btnSecondary, btnSuccess, sizeLarge } from "../ui/theme.ts";
import { Shortcuts } from "./Shortcuts.tsx";

import { Scoreboard } from "../browser/Scoreboard.tsx";
import classNames from "classnames";
import { useBoolean } from "usehooks-ts";

export const Player = ({ demoId }: { demoId: number }) => {
  const [demo, setDemo] = useState<Demo | null>(null);

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

  if (!demo) {
    return <div>Loading...</div>;
  }

  return (
    <ClipEditorProvider>
      <div className="lg:flex min-h-[200px]">
        <div className="flex flex-col grow">
          <div className="flex grow bg-black items-center justify-center max-h-[75vh]">
            <FtePlayer demo={demo} />
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

          <div className="my-6">
            <Result demo={demo} />
          </div>

          <hr className="my-6 border-slate-800" />

          <Shortcuts />
        </div>
      )}
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
