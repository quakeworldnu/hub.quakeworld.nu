import { Timestamp } from "../Timestamp.tsx";
import { ToggleButton } from "../playlist/Playlist.tsx";
import type {
  Demo,
  DemoParticipants,
} from "../services/supabase/supabase.types.ts";
import { DownloadButton, PlayButton } from "./Controls.tsx";
import { ScoreSpoiler } from "./ScoreSpoiler.tsx";

export const DemoList = ({ demos }: { demos: Demo[] | null }) => {
  return (
    <table className="text-left">
      <thead>
        <tr className="text-slate-300 text-xs">
          <th className="p-2 min-w-[100px]">Timestamp</th>
          <th className="p-2">Mode</th>
          <th className="p-2">Map</th>
          <th className="p-2">Title</th>
          <th className="p-2">Score</th>
          <th className="p-2" />
        </tr>
      </thead>
      <tbody className="text-sm">
        {demos?.map((demo) => (
          <ListItem key={demo.id} demo={demo} />
        ))}
      </tbody>
    </table>
  );
};

const ListItem = ({ demo }: { demo: Demo }) => {
  return (
    <tr className="odd:bg-[#1a1a2a] hover:bg-white/10">
      <td className="p-2 text-slate-400 text-xs">
        <Timestamp timestamp={demo.timestamp} />
      </td>
      <td className="p-2 text-slate-400 text-right">{demo.mode}</td>
      <td className="p-2 text-slate-400">{demo.map}</td>
      <td className="p-2">{demo.title}</td>
      <td className="text-center">
        <ScoreSpoiler
          score={getDemoScores(demo.participants as DemoParticipants)}
        />
      </td>
      <td className="p-2 flex items-center space-x-2">
        <PlayButton id={demo.id} />
        <ToggleButton demo={demo} />
        <DownloadButton s3_key={demo.s3_key} />
      </td>
    </tr>
  );
};

function getDemoScores(participants: DemoParticipants): string {
  const { teams, players } = participants;

  let p: number[];

  if (teams.length > 0) {
    teams.sort((a, b) => a.name.localeCompare(b.name));
    p = teams.map((t) => t.frags);
  } else {
    p = players.map((p) => p.frags);
  }

  return p.join(" : ");
}

/*
const Participants = ({ participants }: { participants: DemoParticipants }) => {
  const { teams, players } = participants;

  if (teams.length > 0) {
    return teams
      .map<ReactNode>((team) => (
        <span>
          <strong>
            <QuakeText text={team.name} color={team.name_color} /> (
          </strong>
          {team.players
            .map<ReactNode>((player) => (
              <span className="opacity-80">
                <QuakeText text={player.name} color={player.name_color} />
              </span>
            ))
            .reduce((prev, curr) => [prev, ", ", curr])}
          )
        </span>
      ))
      .reduce((prev, curr) => [prev, " vs ", curr]);
  } else {
    return players
      .map<ReactNode>((player) => (
        <strong>
          <QuakeText text={player.name} color={player.name_color} />
        </strong>
      ))
      .reduce((prev, curr) => [prev, " vs ", curr]);
  }
};
*/
