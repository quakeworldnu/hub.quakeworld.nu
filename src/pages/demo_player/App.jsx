import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { SiteHeader } from "@qwhub/site/Header";
import { SiteFooter } from "@qwhub/site/Footer";

import FtePlayer from "./fte/fte";
import { UserInfo } from "./UserInfo";
import { getAssets } from "./fte/assets";
import {
  getClient,
  getDemo,
} from "@qwhub/pages/demo_player/services/supabase/supabase";
import { useEffectOnce } from "usehooks-ts";
import classNames from "classnames";

export const App = () => {
  return (
    <>
      {false && <SiteHeader />}
      <DemoPlayerApp />
      {false && <SiteFooter />}
    </>
  );
};

export const DemoPlayerApp = () => {
  const query = queryString.parse(location.search);
  const demoId = query.demoId ?? "";

  return (
    <div className="my-6 space-y-4">
      <div className="flex justify-between items-center my-4 space-x-4">
        <div className="flex space-x-10 items-center">
          <div className="text-xl font-bold">Recent demos</div>
          <div>[thumbs] [list]</div>
          <div>[modes]</div>
          <div>[search]</div>
        </div>

        <div>[search]</div>
      </div>

      {!demoId && <RecentDemoTiles />}

      <div className="flex justify-between items-center">
        {demoId && <UserInfo />}
      </div>
      {demoId && <DemoPlayer demoId={demoId} />}
    </div>
  );
};

const RecentDemoTiles = () => {
  const client = getClient();
  const [demos, setDemos] = useState([]);

  useEffectOnce(() => {
    async function run() {
      const { data } = await client
        .from("demos")
        .select("id, map, mode, participants, title, s3_key")
        .eq("mode", "4on4")
        .order("timestamp", { ascending: false })
        .limit(5);
      setDemos(data);
    }

    run();
  });

  return (
    <div className="my-6 grid grid-cols-servers gap-4">
      {demos.map((d) => (
        <DemoTile key={d.id} demo={d} />
      ))}
    </div>
  );
};

const DemoTile = ({ demo }) => {
  return (
    <div>
      <a
        key={demo.id}
        href={`/demo_player/?demoId=${demo.id}`}
        className="flex flex-col border border-white/10 min-h-[200px] bg-no-repeat bg-center bg-cover hover:scale-110 transition-transform hover:shadow-2xl hover:border-4"
        style={{
          backgroundImage: `url(https://raw.githubusercontent.com/vikpe/qw-mapshots/main/${demo.map}.jpg)`,
        }}
      >
        <div className="absolute">
          <ModeRibbon mode={demo.mode} />
        </div>
        {demo.participants.teams.length > 0 && <TeamplayTile demo={demo} />}
      </a>
      {false && (
        <div className="hidden">
          <pre>{JSON.stringify(demo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const TeamplayTile = ({ demo }) => {
  return (
    <div className="grow flex h-full bg-black/50">
      <div className="w-[50%] flex flex-col justify-center bg-gradient-to-r from-blue-600/40">
        <TeamList team={demo.participants.teams[1]} />
      </div>
      <div className="flex items-center -mx-12 z-10">
        <img src="/assets/img/versus.png" className="w-24 h-24" />
      </div>
      <div className="w-[50%] flex flex-col justify-center bg-gradient-to-l from-red-600/40">
        <TeamList team={demo.participants.teams[0]} />
      </div>
    </div>
  );
};

const TeamList = ({ team }) => {
  return (
    <div className="app-text-shadow">
      <div className="text-lg font-bold text-center mb-1">{team.name}</div>
      <div className="text-center">
        {team.players.map((p) => (
          <div key={p.name}>{p.name}</div>
        ))}
      </div>
    </div>
  );
};

const ModeRibbon = ({ mode }) => {
  return (
    <span
      className={classNames(
        "-mt-3 -ml-3 w-14 h-14 bg-gradient-to-t -rotate-12 rounded-full text-white font-mono font-bold justify-center items-center flex z-10 app-text-shadow",
        {
          "from-emerald-800 to-emerald-600": mode === "4on4",
          "from-blue-800 to-blue-600": mode === "2on2",
          "from-green-800 to-green-600": mode === "1on1",
        },
      )}
    >
      {mode}
    </span>
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
      <div className="flex p-3 bg-white/5 text-sm text-gray-200 justify-between">
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

          <div className="flex flex-row py-8 justify-around border-t border-white/10">
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
        <div className="flex flex-col w-[400px] ml-4 hidden">
          <div className="flex px-6 py-7 bg-white/5 space-x-6">
            <div className="border-b-2 border-blue-500 font-bold">Chat</div>
            <div>Playlist</div>
            <div>Related demos</div>
          </div>
          <div className="flex flex-col bg-blue-400/10 h-full">
            {/*<Chat />*/}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
