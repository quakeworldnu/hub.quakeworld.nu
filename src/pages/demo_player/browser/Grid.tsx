import classNames from "classnames";
import {
  Demo,
  Participants,
  Player,
} from "../services/supabase/supabase.types.ts";
import { Timestamp } from "./Timestamp.tsx";

export const Grid = ({ demos }: { demos: Demo[] | null }) => {
  return (
    <div className="my-6 grid grid-cols-servers gap-6">
      {demos?.map((demo) => <DemoItem key={demo.id} demo={demo} />)}
    </div>
  );
};

const DemoItem = ({ demo }: { demo: Demo }) => {
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
          <ModeRibbon mode={demo.mode} />
        </div>

        <ParticipantsZZZ participants={demo.participants as Participants} />

        <div className="flex -mt-8 h-6 px-2 text-right ml-auto items-center bg-gray-900/50 text-xs rounded mr-2 mb-2">
          {demo.map}
        </div>
      </a>

      <div className="mt-2 text-xs text-slate-400 text-center">
        <Timestamp timestamp={demo.timestamp} />{" "}
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

const ParticipantsZZZ = ({ participants }: { participants: Participants }) => {
  const hasTeams = participants.teams.length > 0;
  const titles = hasTeams
    ? participants.teams.map((t) => t.name)
    : participants.players.map((p) => p.name);

  return (
    <div className="grow flex h-full bg-gray-700/20 app-text-shadow">
      <div className="w-1/2 flex flex-col justify-center">
        <div className="ml-auto">
          <div className="font-bold text-center text-2xl">{titles[0]}</div>
          {hasTeams && <PlayerList players={participants.teams[0].players} />}
        </div>
      </div>
      <Versus />
      <div className="w-1/2 flex flex-col justify-center">
        <div className="mr-auto">
          <div className="font-bold text-center text-2xl">{titles[1]}</div>
          {hasTeams && <PlayerList players={participants.teams[1].players} />}
        </div>
      </div>
    </div>
  );
};

const PlayerList = ({ players }: { players: Player[] }) => {
  return (
    <div className="text-center mx-1">
      {players.map((p) => (
        <div key={p.name}>{p.name}</div>
      ))}
    </div>
  );
};

const ModeRibbon = ({ mode }: { mode: string }) => {
  return (
    <div className="w-24 h-24 overflow-hidden">
      <div
        className={classNames(
          "flex -translate-x-[45%] -translate-y-[195%] -rotate-45 origin-bottom-right h-8 w-48 bg-gradient-to-bl justify-center items-center z-10 text-white app-text-shadow font-bold text-sm",
          {
            "from-red-500 to-red-900": mode === "4on4",
            "from-blue-500 to-blue-900": mode === "2on2",
            "from-green-500 to-green-900": mode === "1on1",
          },
        )}
      >
        {mode}
      </div>
    </div>
  );
};
