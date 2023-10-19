import { Demo } from "../services/supabase/supabase.types.ts";
import { Timestamp } from "./Timestamp.tsx";

export const List = ({ demos }: { demos: Demo[] | null }) => {
  return (
    <table className="my-6 text-left text-sm">
      <thead>
        <tr>
          <th className="p-2 min-w-[120px]">Timestamp</th>
          <th className="p-2">Mode</th>
          <th className="p-2">Map</th>
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

function demoDownloadUrl(s3Key: string) {
  return `https://quakeworld.s3.eu-central-1.amazonaws.com/${s3Key}`;
}

const ListItem = ({ demo }: { demo: Demo }) => {
  return (
    <tr className="odd:bg-[#1a1a2a] hover:bg-white/10">
      <td className="p-2 text-slate-400 text-xs">
        <Timestamp timestamp={demo.timestamp} />
      </td>
      <td className="p-2 text-slate-400 text-right">{demo.mode}</td>
      <td className="p-2 text-slate-400">{demo.map}</td>
      <td className="p-2">{demo.title}</td>
      <td className="p-2 space-x-3">
        <a href={`/demo_player/?demoId=${demo.id}`} className="text-blue-500">
          Play
        </a>

        <a href={demoDownloadUrl(demo.s3_key)} className="text-blue-500">
          Download
        </a>
      </td>
    </tr>
  );
};
