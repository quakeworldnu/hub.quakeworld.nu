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
import { useClipEditor } from "./clips/context.tsx";
import { ShareDemoButton } from "./Share.tsx";
import { btnSuccess, sizeLarge } from "../ui/theme.ts";

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
    <>
      <DemoBreadcrumbs demo={demo} />
      <div className="lg:flex min-h-[200px] mt-4">
        <div className="flex flex-col grow">
          <div className="flex grow bg-black items-center justify-center max-h-[75vh]">
            <FtePlayer demo={demo} />
          </div>
          <DemoPlayerFooter demo={demo} />
        </div>
      </div>
    </>
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
            <div className="flex items-start my-3 md:my-0 gap-3">
              <EnableClipEditorButton />
              <ShareDemoButton />
              <DownloadDemoButton s3_key={demo.s3_key} />
            </div>
          </div>

          <hr className="my-6 border-slate-800" />

          <KeyboardShortcuts />
        </div>
      )}
    </div>
  );
};

const KeyboardShortcuts = () => {
  const shortcuts = [
    {
      keys: ["~"],
      description: "Toggle console",
    },
    {
      keys: ["Tab"],
      description: "Toggle scoreboard",
    },
    {
      keys: ["Ctrl"],
      description: "Toggle play/pause",
    },
    {
      keys: ["Space"],
      description: "Track next player",
    },
    {
      keys: [">"],
      description: "Fast forward 1 second",
    },
    {
      keys: ["Shift", ">"],
      description: "Fast forward 10 seconds",
    },
    {
      keys: ["<"],
      description: "Rewind 1 second",
    },
    {
      keys: ["Shift", "<"],
      description: "Rewind 10 seconds",
    },
    {
      keys: ["1"],
      description: "Default graphics",
    },
    {
      keys: ["2"],
      description: "Vanilla Quake graphics",
    },
    {
      keys: ["3"],
      description: "Fast graphics",
    },
  ];

  // chunk shortcuts into groups of 4
  const chunkSize = 4;
  const chunkedShortcuts = [];
  for (let i = 0; i < shortcuts.length; i += chunkSize) {
    chunkedShortcuts.push(shortcuts.slice(i, i + chunkSize));
  }

  return (
    <div>
      <div className="font-bold text-slate-300 mb-2">Keyboard shortcuts</div>

      <div className="flex flex-row flex-wrap space-x-10">
        {chunkedShortcuts.map((chunk, i) => (
          <div className="space-y-2" key={i}>
            {chunk.map((shortcut, j) => (
              <div key={j} className="flex flex-row items-center space-x-4">
                <div className="text-slate-400 text-sm w-40">
                  {shortcut.description}
                </div>
                <div className="flex items-center space-x-2">
                  <kbd>{shortcut.keys[0]}</kbd>
                  {shortcut.keys[1] && (
                    <>
                      <span className="text-slate-400">+</span>
                      <kbd>{shortcut.keys[1]}</kbd>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
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

export const DemoBreadcrumbs = ({ demo }: { demo: Demo }) => {
  const demoDescription = getDemoDescription(demo);
  const demoBreadcrumbs = [demoDescription];

  return (
    <div className="flex p-3 bg-white/5 text-sm text-slate-300">
      <a href={`/recent_games/`}>Recent games</a>
      {demoBreadcrumbs.map((b, i) => (
        <span key={i}>
          <span className="mx-2 text-gray-500">/</span>
          {b}
        </span>
      ))}
    </div>
  );
};
