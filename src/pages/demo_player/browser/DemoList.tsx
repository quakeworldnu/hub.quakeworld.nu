import { Demo } from "../services/supabase/supabase.types.ts";
import { Timestamp } from "../Timestamp.tsx";
import { ToggleButton } from "../playlist/Playlist.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPlay } from "@fortawesome/free-solid-svg-icons";
import { getDemoDownloadUrl } from "../services/supabase/demo.ts";

export const DemoList = ({ demos }: { demos: Demo[] | null }) => {
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

const ListItem = ({ demo }: { demo: Demo }) => {
  return (
    <tr className="odd:bg-[#1a1a2a] hover:bg-white/10">
      <td className="p-2 text-slate-400 text-xs">
        <Timestamp timestamp={demo.timestamp} />
      </td>
      <td className="p-2 text-slate-400 text-right">{demo.mode}</td>
      <td className="p-2 text-slate-400">{demo.map}</td>
      <td className="p-2">{demo.title}</td>
      <td className="p-2 flex items-center space-x-2">
        <PlayButton id={demo.id} />
        <ToggleButton demo={demo} />
        <DownloadButton s3_key={demo.s3_key} />
      </td>
    </tr>
  );
};

export const PlayButton = ({ id }: { id: number }) => {
  return (
    <a
      href={`/demo_player/?demoId=${id}`}
      className="flex items-center justify-center text-blue-500 hover:text-blue-300 w-8 h-8 hover:scale-125 transition-transform"
      title="Play"
    >
      <FontAwesomeIcon fixedWidth icon={faPlay} size={"lg"} />
    </a>
  );
};

export const DownloadButton = ({ s3_key }: { s3_key: string }) => {
  return (
    <a
      href={getDemoDownloadUrl(s3_key)}
      className="flex items-center justify-center text-slate-500 hover:text-slate-300 w-8 h-8 hover:scale-125 transition-transform"
      title="Download"
    >
      <FontAwesomeIcon fixedWidth icon={faFloppyDisk} size={"lg"} />
    </a>
  );
};
