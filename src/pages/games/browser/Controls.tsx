import { faFloppyDisk, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDownloadUrl } from "../services/cloudfront/cdemos.ts";

export const PlayButton = ({ id }: { id: number }) => {
  return (
    <a
      href={`/games/?gameId=${id}`}
      className="flex items-center justify-center text-blue-500 hover:text-blue-300 w-8 h-8 hover:scale-125 transition-transform"
      title="Play"
    >
      <FontAwesomeIcon fixedWidth icon={faPlay} size={"lg"} />
    </a>
  );
};
export const DownloadButton = ({ sha256 }: { sha256: string }) => {
  return (
    <a
      href={getDownloadUrl(sha256)}
      className="flex items-center justify-center text-slate-500 hover:text-slate-300 w-8 h-8 hover:scale-125 transition-transform"
      title="Download"
    >
      <FontAwesomeIcon fixedWidth icon={faFloppyDisk} size={"lg"} />
    </a>
  );
};
