import classNames from "classnames";
import React, { useState } from "react";
import { getClient } from "@qwhub/pages/demo_player/services/supabase/supabase";
import { useEffectOnce } from "usehooks-ts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

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
        .limit(25);
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
  const format = dayjs(timestamp).from(dayjs());

  return <>{format}</>;
};

const DemoTile = ({ demo }) => {
  return (
    <div>
      <a
        key={demo.id}
        href={`/demo_player/?demoId=${demo.id}`}
        className={classNames(
          "flex flex-col border min-h-[200px] bg-no-repeat bg-center bg-cover hover:scale-125 transition-transform hover:shadow-2xl hover:z-20 hover:relative",
          {
            "border-green-800": demo.mode === "1on1",
            "border-blue-800": demo.mode === "2on2",
            "border-red-800": demo.mode === "4on4",
          },
        )}
        style={{
          backgroundImage: `url(https://raw.githubusercontent.com/vikpe/qw-mapshots/main/${demo.map}.jpg)`,
        }}
      >
        <div className="absolute">
          <ModeRibbon mode={demo.mode} map={demo.map} />
        </div>
        <Participants participants={demo.participants} />
      </a>

      <div className="mt-2 text-xs text-slate-400 text-center">
        <DemoTimestamp timestamp={demo.timestamp} />{" "}
        <span className="text-slate-500">@</span> {demo.source.split(":")[0]}
      </div>
    </div>
  );
};

const Versus = () => {
  return (
    <div className="flex justify-center items-center w-16 app-text-shadow font-bold text-xl text-amber-300">
      VS
    </div>
  );
};

const Participants = ({ participants }) => {
  const hasTeams = participants.teams.length > 0;
  const titles = hasTeams
    ? participants.teams.map((t) => t.name)
    : participants.players.map((p) => p.name);

  return (
    <div className="grow flex h-full bg-gray-700/20 app-text-shadow">
      <div className="w-1/2 flex flex-col justify-center">
        <div className="ml-auto">
          <div className="font-bold text-center text-2xl">{titles[0]}</div>
          {hasTeams && <PlayerList team={participants.teams[0]} />}
        </div>
      </div>
      <Versus />
      <div className="w-1/2 flex flex-col justify-center">
        <div className="mr-auto">
          <div className="font-bold text-center text-2xl">{titles[1]}</div>
          {hasTeams && <PlayerList team={participants.teams[1]} />}
        </div>
      </div>
    </div>
  );
};

const PlayerList = ({ team }) => {
  return (
    <div className="text-center mx-1">
      {team.players.map((p) => (
        <div key={p.name}>{p.name}</div>
      ))}
    </div>
  );
};

const ModeRibbon = ({ mode }) => {
  return (
    <div className="w-24 h-24 overflow-hidden">
      <div
        className={classNames(
          "-translate-x-[45%] -translate-y-[195%] -rotate-45 origin-bottom-right h-8 w-48 bg-gradient-to-bl text-white font-mono justify-center items-center flex z-10 app-text-shadow",
          {
            "from-red-600 to-red-700": mode === "4on4",
            "from-blue-600 to-blue-700": mode === "2on2",
            "from-green-600 to-green-700": mode === "1on1",
          },
        )}
      >
        {mode}
      </div>
    </div>
  );
};
