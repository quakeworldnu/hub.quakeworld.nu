import React, { useEffect, useState } from "react";
import { getDemo } from "@qwhub/pages/demo_player/services/supabase/supabase";
import { getAssets } from "@qwhub/pages/demo_player/fte/assets";
import FtePlayer from "@qwhub/pages/demo_player/fte/fte";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSquare } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { DemoTiles } from "@qwhub/pages/demo_player/DemoTiles";
import { UserInfo } from "@qwhub/pages/demo_player/UserInfo";
import { Chat } from "./Chat";

export const DemoPlayerApp = () => {
  const query = queryString.parse(location.search);
  const demoId = query.demoId ?? "";

  return (
    <div className="my-6">
      {!demoId && (
        <div className="flex justify-between items-center my-4 space-x-4">
          <BrowserControls />
        </div>
      )}

      {!demoId && <DemoTiles />}
      {demoId && <DemoPlayer demoId={demoId} />}
    </div>
  );
};

export const BrowserControls = () => {
  return (
    <div className="flex space-x-10 items-center">
      <div className="flex space-x-2 items-center">
        <div className="p-1 px-1.5 bg-blue-500/20 rounded border border-white/10">
          <FontAwesomeIcon icon={faSquare} size={"xl"} color={"#abc"} />
        </div>
        <FontAwesomeIcon icon={faBars} size={"xl"} color={"#789"} />
      </div>
      <div className="flex space-x-1 items-center">
        {["All", "1on1", "2on2", "4on4", "CTF", "Race", "Other"].map(
          (mode, index) => (
            <div
              key={mode}
              className={classNames({
                "font-bold border border-white/10 px-2 py-1 bg-blue-500/20 rounded":
                  index === 0,
                "text-gray-400 text-sm px-2 py-1": index !== 0,
              })}
            >
              {mode}
            </div>
          ),
        )}
      </div>
      <div>
        <input
          type="search"
          className="border border-white/10 px-2 py-1 bg-blue-500/20 rounded"
          name=""
          id=""
        />
      </div>
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

  const demoBreadcrumbs = ["Recent"];
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
      <div className="flex min-h-[800px]">
        <div className="flex flex-col grow">
          <div className="flex grow bg-black items-center justify-center max-h-[60vh]">
            <FtePlayer files={files} demoTotalTime={demo.duration} />
          </div>
          <div className="py-6 flex justify-between">
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {demo.mode}: {demo.title} [{demo.map}]
              </div>
              <div className="text-slate-400">
                Played on {demo.source} at {demo.timestamp}
              </div>
            </div>
            <div>
              <a
                href={demoUrl}
                className="py-3 px-4 rounded bg-blue-600/50 hover:bg-blue-600/80 cursor-pointer"
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
        <div className="flex flex-col w-[400px] ml-4">
          <div className="flex px-6 py-7 bg-white/5 space-x-6">
            <div className="border-b-2 border-blue-500 font-bold">Chat</div>
            <div>Playlist</div>
            <div>Related demos</div>
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
