import { useEffect, useState } from "react";
import { getDemo } from "../services/supabase/supabase";
import { Timestamp } from "../browser/Timestamp";
import { Playlist } from "../playlist/Playlist";
import { Demo } from "../services/supabase/supabase.types.ts";
import { getDemoDescription, getDemoUrl } from "../demo.ts";
import { FtePlayer } from "../fte/fte.tsx";

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
      <div className="lg:flex min-h-[800px]">
        <div className="flex flex-col grow">
          <div className="flex grow bg-black items-center justify-center max-h-[75vh]">
            <FtePlayer demo={demo} />
          </div>
          <DemoPlayerFooter demo={demo} />
        </div>
        <div className="flex flex-col w-auto lg:w-[280px] 2xl:w-[360px] lg:ml-4">
          <Playlist />
        </div>
      </div>
    </>
  );
};

export const DemoPlayerFooter = ({ demo }: { demo: Demo }) => {
  return (
    <div className="py-6 md:flex justify-between">
      <DemoInfo demo={demo} />
      <div>
        <DownloadDemoButton s3_key={demo.s3_key} />
      </div>
    </div>
  );
};

export const DemoInfo = ({ demo }: { demo: Demo }) => {
  const demoDescription = getDemoDescription(demo);

  return (
    <div className="space-y-2">
      <div className="text-2xl font-bold">{demoDescription}</div>
      <div className="text-slate-400 text-sm">
        <Timestamp timestamp={demo.timestamp} /> on {demo.source}
      </div>
    </div>
  );
};

export const DownloadDemoButton = ({ s3_key }: { s3_key: string }) => {
  const demoUrl = getDemoUrl(s3_key);

  return (
    <a
      href={demoUrl}
      className="flex mt-4 md:mt-0 py-2.5 px-4 rounded bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800"
    >
      Download demo
    </a>
  );
};

export const DemoBreadcrumbs = ({ demo }: { demo: Demo }) => {
  const demoDescription = getDemoDescription(demo);
  const demoBreadcrumbs = [demoDescription];

  return (
    <div className="flex p-3 bg-white/5 text-sm text-slate-300 my-4">
      <a href={`/demo_player/`}>Demos</a>
      {demoBreadcrumbs.map((b, i) => (
        <span key={i}>
          <span className="mx-2 text-gray-500">/</span>
          {b}
        </span>
      ))}
    </div>
  );
};
