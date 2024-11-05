import {
  faChartPie,
  faFloppyDisk,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DemoStats } from "@qwhub/pages/games/player/DemoStats.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@qwhub/shadcn/components/ui/dialog.tsx";
import { useBoolean } from "usehooks-ts";
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

const secondaryBtnCls =
  "flex items-center justify-center text-slate-500 hover:text-slate-300 w-8 h-8 hover:scale-125 transition-transform";

export const DownloadButton = ({ sha256 }: { sha256: string }) => {
  return (
    <a
      href={getDownloadUrl(sha256)}
      className={secondaryBtnCls}
      title="Download demo"
    >
      <FontAwesomeIcon fixedWidth icon={faFloppyDisk} size={"lg"} />
    </a>
  );
};

export const StatsButton = ({ sha256 }: { sha256: string }) => {
  const { value: isOpen, toggle: toggleOpen } = useBoolean(false);

  return (
    <>
      {isOpen && (
        <div className="absolute left-0 top-0 w-full h-full bg-black/80 z-40 max-w-full max-h-full overflow-hidden" />
      )}
      <Dialog modal={false} defaultOpen={isOpen} onOpenChange={toggleOpen}>
        <DialogTitle className="sr-only">Stats</DialogTitle>
        <DialogTrigger asChild>
          <button className={secondaryBtnCls} title="Show stats">
            <FontAwesomeIcon fixedWidth icon={faChartPie} size={"lg"} />
          </button>
        </DialogTrigger>
        <DialogContent className="bg-background min-w-64 min-h-20 max-w-fit overflow-auto">
          <DialogDescription className="sr-only" aria-description="Stats" />
          <DemoStats sha256={sha256} />
        </DialogContent>
      </Dialog>
    </>
  );
};
