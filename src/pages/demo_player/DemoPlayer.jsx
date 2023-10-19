import React, { useEffect, useState } from "react";
import { getDemo } from "@qwhub/pages/demo_player/services/supabase/supabase";
import { getAssets } from "@qwhub/pages/demo_player/fte/assets";
import FtePlayer from "@qwhub/pages/demo_player/fte/fte";
import queryString from "query-string";
import { Grid } from "@qwhub/pages/demo_player/browser/Grid";
import { UserInfo } from "@qwhub/pages/demo_player/UserInfo";
import { Chat } from "./Chat";
import { Settings } from "@qwhub/pages/demo_player/browser/Browser";
import { Timestamp } from "@qwhub/pages/demo_player/browser/Timestamp";

export const DemoPlayerApp = () => {
  const query = queryString.parse(location.search);
  const demoId = query.demoId ?? "";

  return (
    <div className="my-6">
      {!demoId && (
        <div className="flex justify-between items-center my-4 space-x-4">
          <Settings onChange={onSettingsChange} />
        </div>
      )}

      {!demoId && <Grid />}
      {demoId && <DemoPlayer demoId={demoId} />}
    </div>
  );
};

export const DemoPlayer = ({ demoId }) => {
  const [demo, setDemo] = useState(null);

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

  const demoDescription = `${demo.mode}: ${demo.title} [${demo.map}]`;
  const demoBreadcrumbs = [demoDescription];
  const demoUrl = [import.meta.env.VITE_AWS_S3_BUCKET_URL, demo.s3_key].join(
    "/",
  );
  const files = getAssets(demoUrl, demo.map);

  return (
    <>
      <div className="flex p-3 bg-white/5 text-sm text-gray-200 justify-between my-4">
        <div>
          <a href={`/demo_player/`}>Demos</a>
          {demoBreadcrumbs.map((b, i) => (
            <span key={i}>
              <span className="mx-2 text-gray-500">/</span>
              {b}
            </span>
          ))}
        </div>
      </div>
      <div className="lg:flex min-h-[800px]">
        <div className="flex flex-col grow">
          <div className="flex grow bg-black items-center justify-center max-h-[75vh]">
            <FtePlayer files={files} demoTotalTime={demo.duration} />
          </div>
          <div className="py-6 md:flex justify-between">
            <div className="space-y-2">
              <div className="text-2xl font-bold">{demoDescription}</div>
              <div className="text-slate-400">
                <Timestamp timestamp={demo.timestamp} /> on {demo.source}
              </div>
            </div>
            <div>
              <a
                href={demoUrl}
                className="inline-block mt-4 md:mt-0 py-2.5 px-4 rounded bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800"
              >
                Download demo
              </a>
            </div>
          </div>

          <div className="flex flex-row py-8 justify-around border-t border-white/10 hidden">
            <div className="flex space-x-28 text-sm">
              <div>
                <div className="text-gray-500 text-right">Previous</div>
                <div className="text-gray-300">
                  4on4: SR vs -SD- [dm3] QHLAN 13 - 4on4 Playoffs - Semi Final A
                </div>
              </div>
              <div>
                <div className="text-sky-400">Next</div>
                <div className="text-sky-300 font-bold">
                  4on4: SR vs -SD- [dm3] QHLAN 13 - 4on4 Playoffs - Semi Final A
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-auto lg:w-[280px] 2xl:w-[360px] lg:ml-4">
          <div className="flex px-6 py-7 bg-white/5 space-x-6">
            <div className="border-b-2 border-blue-500 font-bold">Chat</div>
            <div className="text-slate-400">Playlist</div>
            <div className="text-slate-400">Related demos</div>
          </div>
          <div className="p-6">
            <UserInfo />
          </div>
          <div className="flex flex-col bg-blue-400/10 h-full">
            <Chat />
          </div>
        </div>
      </div>
    </>
  );
};
