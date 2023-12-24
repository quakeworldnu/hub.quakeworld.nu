import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPlay } from "@fortawesome/free-solid-svg-icons";
import { getDemoDownloadUrl } from "../services/supabase/demo.ts";

export const PlayButton = ({ id }: { id: number }) => {
  return (
    <a
      href={`/games/?demoId=${id}`}
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
