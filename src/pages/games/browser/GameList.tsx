import { Timestamp } from "../Timestamp.tsx";
import type {
  Game,
  GamePlayer,
  GameTeam,
} from "../services/supabase/supabase.types.ts";
import { DownloadButton, PlayButton } from "./Controls.tsx";
import { ScoreSpoiler } from "./ScoreSpoiler.tsx";

export const GameList = ({ games }: { games: Game[] | null }) => {
  return (
    <table className="text-left">
      <thead>
        <tr className="text-slate-300 text-xs">
          <th className="p-2 min-w-[100px]">Date</th>
          <th className="p-2">Score</th>
          <th className="p-2" />
        </tr>
      </thead>
      <tbody className="text-sm">
        {games?.map((demo) => (
          <ListItem key={demo.id} Game={demo} />
        ))}
      </tbody>
    </table>
  );
};

const ListItem = ({ Game }: { Game: Game }) => {
  return (
    <tr className="odd:bg-[#1a1a2a] hover:bg-white/10">
      <td className="p-2 text-slate-400 text-xs">
        <Timestamp timestamp={Game.timestamp} />
      </td>
      <td className="p-2 text-slate-400 text-right">{Game.mode}</td>
      <td className="p-2 text-slate-400">{Game.map}</td>
      <td className="p-2">TODO</td>
      <td className="text-center">
        <ScoreSpoiler
          score={getDemoScores(
            Game.teams as GameTeam[],
            Game.players as GamePlayer[],
          )}
        />
      </td>
      <td className="p-2 flex items-center space-x-2">
        <PlayButton id={Game.id} />
        {Game.demo_sha256 && <DownloadButton sha256={Game.demo_sha256} />}
      </td>
    </tr>
  );
};

function getDemoScores(
  teams: GameTeam[] = [],
  players: GamePlayer[] = [],
): string {
  let p: number[];

  if (teams.length > 0) {
    teams.sort((a, b) => a.name.localeCompare(b.name));
    p = teams.map((t) => t.frags);
  } else {
    p = players.map((p) => p.frags);
  }

  return p.join(" : ");
}
