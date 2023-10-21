import classNames from "classnames";
import { Demo, DemoParticipants } from "../services/supabase/supabase.types.ts";
import { Timestamp } from "./Timestamp.tsx";
import { ModeRibbon } from "./ModeRibbon.tsx";
import { ParticipantsZZZ } from "./Participants.tsx";

export const Grid = ({ demos }: { demos: Demo[] | null }) => {
  return (
    <div className="my-6 grid grid-cols-servers gap-4">
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
          "flex flex-col border min-h-[200px] bg-slate-800 bg-no-repeat bg-center bg-cover hover:scale-125 transition-transform hover:shadow-2xl hover:z-20 hover:relative",
          {
            "border-green-800": demo.mode === "1on1",
            "border-blue-800": demo.mode === "2on2",
            "border-red-800": demo.mode === "4on4",
            "border-amber-700": demo.mode === "ctf",
          },
        )}
        style={{
          backgroundImage: `url(https://raw.githubusercontent.com/vikpe/qw-mapshots/main/${demo.map}.jpg)`,
        }}
      >
        <div className="absolute">
          <ModeRibbon mode={demo.mode} />
        </div>

        <ParticipantsZZZ participants={demo.participants as DemoParticipants} />

        <div className="flex -mt-8 h-6 px-2 text-right ml-auto items-center bg-gray-900/50 text-xs rounded-lg mr-2 mb-2">
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
