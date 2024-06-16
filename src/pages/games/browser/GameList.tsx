import { Timestamp } from "../Timestamp.tsx";
import { GameSearchEntry } from "../services/supabase/supabase.ts";
import type {
  GamePlayer,
  GameTeam,
} from "../services/supabase/supabase.types.ts";
import { DownloadButton, PlayButton } from "./Controls.tsx";
import { ScoreSpoiler } from "./ScoreSpoiler.tsx";

export const GameList = ({ games }: { games: GameSearchEntry[] | null }) => {
  return (
    <table className="text-left">
      <thead>
        <tr className="text-slate-300 text-xs">
          <th className="py-1 px-3 min-w-[100px]">Date</th>
          <th className="py-1 px-3">Score</th>
          <th className="py-1 px-3">Map</th>
          <th className="py-1 px-3">Players/Teams</th>
          <th className="py-1 px-3">Score</th>
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

const ListItem = ({ Game }: { Game: GameSearchEntry }) => {
  return (
    <tr className="odd:bg-[#1a1a2a] hover:bg-white/10">
      <td className="py-1 px-3 text-slate-400 text-xs">
        <Timestamp timestamp={Game.timestamp} />
      </td>
      <td className="py-1 px-3 text-slate-400">{Game.mode}</td>
      <td className="py-1 px-3 text-slate-400">{Game.map}</td>
      <td className="py-1 px-3">
        <a
          href={`/games/?gameId=${Game.id}`}
          className="text-blue-300 hover:text-white hover:underline"
        >
          {getDemoParticipants(
            Game.teams as GameTeam[],
            Game.players as GamePlayer[],
          )}
        </a>
      </td>
      <td className="text-center font-mono text-xs">
        <ScoreSpoiler
          score={getDemoScores(
            Game.teams as GameTeam[],
            Game.players as GamePlayer[],
          )}
        />
      </td>
      <td className="py-1 px-3 flex items-center space-x-2">
        <PlayButton id={Game.id} />
        {Game.demo_sha256 && <DownloadButton sha256={Game.demo_sha256} />}
      </td>
    </tr>
  );
};

function getDemoParticipants(
  teams: GameTeam[] = [],
  players: GamePlayer[] = [],
): string {
  let p: string[];

  if (teams.length > 0) {
    p = teams.map((t) => t.name);
  } else {
    p = players.map((t) => t.name);
  }

  return p.join(" vs ");
}

function getDemoScores(
  teams: GameTeam[] = [],
  players: GamePlayer[] = [],
): string {
  let p: number[];

  if (teams.length > 0) {
    p = teams.map((t) => t.frags);
  } else {
    p = players.map((p) => p.frags);
  }

  return p.join(" : ");
}
