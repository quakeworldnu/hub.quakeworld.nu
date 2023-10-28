import { Demo, DemoParticipants } from "../services/supabase/supabase.types.ts";
import { Timestamp } from "../Timestamp.tsx";
import { ToggleButton } from "../playlist/Playlist.tsx";
import { ScoreSpoiler } from "./ScoreSpoiler.tsx";
import { DownloadButton, PlayButton } from "./Controls.tsx";

export const DemoList = ({ demos }: { demos: Demo[] | null }) => {
  return (
    <table className="text-left text-sm">
      <thead>
        <tr>
          <th className="p-2 min-w-[120px]">Timestamp</th>
          <th className="p-2">Server</th>
          <th className="p-2">Mode</th>
          <th className="p-2">Map</th>
          <th className="p-2">Score</th>
          <th className="p-2">Title</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {demos?.map((demo) => <ListItem key={demo.id} demo={demo} />)}
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
      <td className="p-2 text-slate-400">
        {demo.source.replace(":28000", "")}
      </td>
      <td className="p-2 text-slate-400 text-right">{demo.mode}</td>
      <td className="p-2 text-slate-400">{demo.map}</td>
      <td className="text-center">
        <ScoreSpoiler
          score={getDemoScores(demo.participants as DemoParticipants)}
        />
      </td>
      <td className="p-2">{demo.title}</td>
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
    p = teams.map((t) => t.frags);
  } else {
    p = players.map((p) => p.frags);
  }

  return p.join(" : ");
}
