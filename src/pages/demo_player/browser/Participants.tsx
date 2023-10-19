import { DemoParticipants } from "../services/supabase/supabase.types.ts";
import { PlayerList } from "./PlayerList.tsx";

export const Versus = () => {
  return (
    <div className="flex justify-center items-center w-16 app-text-shadow font-bold text-xl text-amber-300">
      VS
    </div>
  );
};
export const ParticipantsZZZ = ({
  participants,
}: {
  participants: DemoParticipants;
}) => {
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
