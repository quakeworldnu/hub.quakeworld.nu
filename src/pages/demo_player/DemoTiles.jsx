import classNames from "classnames";
import React, { useState } from "react";
import { getClient } from "@qwhub/pages/demo_player/services/supabase/supabase";
import { useEffectOnce } from "usehooks-ts";
import dayjs from "dayjs";

export const DemoTiles = () => {
  const client = getClient();
  const [demos, setDemos] = useState([]);

  useEffectOnce(() => {
    async function run() {
      const { data } = await client
        .from("demos")
        .select("id, map, mode, participants, title, source, s3_key, timestamp")
        //.eq("mode", "4on4")
        .order("timestamp", { ascending: false })
        .limit(15);
      setDemos(data);
    }

    run();
  });

  return (
    <div className="my-6 grid grid-cols-servers gap-6">
      {demos.map((d) => (
        <DemoTile key={d.id} demo={d} />
      ))}
    </div>
  );
};
const DemoTimestamp = ({ timestamp }) => {
  const format = dayjs().from(dayjs(timestamp));

  return <>{format}</>;
};
const DemoTile = ({ demo }) => {
  const hasTeams = demo.participants.teams.length > 0;

  return (
    <div>
      <a
        key={demo.id}
        href={`/demo_player/?demoId=${demo.id}`}
        className="flex flex-col border border-white/10 min-h-[200px] bg-no-repeat bg-center bg-cover hover:scale-125 transition-transform hover:shadow-2xl hover:z-20 hover:relative"
        style={{
          backgroundImage: `url(https://raw.githubusercontent.com/vikpe/qw-mapshots/main/${demo.map}.jpg)`,
        }}
      >
        <div className="absolute">
          <ModeRibbon mode={demo.mode} />
        </div>
        {hasTeams && <TeamplayTile demo={demo} />}
        {!hasTeams && <DuelTime demo={demo} />}
      </a>
      {false && (
        <div className="">
          <pre>{JSON.stringify(demo, null, 2)}</pre>
        </div>
      )}

      <div className="mt-2 text-xs text-slate-400 text-center">
        <DemoTimestamp timestamp={demo.timestamp} /> @ {demo.source}
      </div>
    </div>
  );
};
const DuelTime = ({ demo }) => {
  return (
    <div className="grow flex h-full bg-black/30">
      <div className="grow flex flex-col justify-center bg-gradient-to-r from-blue-600/20">
        <div className="app-text-shadow font-bold text-right text-2xl">
          {demo.participants.players[0].name}
        </div>
      </div>
      <div className="flex items-center w-16">
        <img src="/assets/img/versus.png" className="w-full" />
      </div>
      <div className="grow flex flex-col justify-center bg-gradient-to-l from-red-600/20">
        <div className="app-text-shadow font-bold text-left text-2xl">
          {demo.participants.players[1].name}
        </div>
      </div>
    </div>
  );
};
const TeamplayTile = ({ demo }) => {
  return (
    <div className="grow flex h-full bg-black/10">
      <div className="grow flex flex-col justify-center">
        <TeamList team={demo.participants.teams[0]} />
      </div>
      <div className="flex items-center w-20 -mx-20">
        <img src="/assets/img/versus.png" className="w-full" />
      </div>
      <div className="grow flex flex-col justify-center">
        <TeamList team={demo.participants.teams[1]} />
      </div>
    </div>
  );
};
const TeamList = ({ team }) => {
  return (
    <div className="app-text-shadow">
      <div className="text-2xl font-bold text-center mb-1">{team.name}</div>
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
