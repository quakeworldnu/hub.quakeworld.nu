import { DemoPlayer } from "../services/supabase/supabase.types.ts";

export const PlayerList = ({ players }: { players: DemoPlayer[] }) => {
  return (
    <div className="text-center mx-1">
      {players.map((p) => (
        <div key={p.name}>{p.name}</div>
      ))}
    </div>
  );
};
