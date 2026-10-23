import {
  faChartPie,
  faFloppyDisk,
  faPlay,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@qwhub/Dialog.tsx";
import { FontAwesomeIcon } from "@qwhub/FontAwesomeIcon";
import { DemoKtxStats } from "@qwhub/pages/games/fte/player/DemoKtxStats.tsx";
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
  const { value: isOpen, setTrue: open, setFalse: close } = useBoolean(false);

  return (
    <>
      <button className={secondaryBtnCls} title="Show stats" onClick={open}>
        <FontAwesomeIcon fixedWidth icon={faChartPie} size={"lg"} />
      </button>
      <Dialog
        open={isOpen}
        onClose={close}
        label="Stats"
        className="animate-contentShow fixed left-[50%] top-[50%] m-0 open:grid w-full min-w-64 min-h-20 max-w-fit translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background text-inherit p-6 shadow-lg sm:rounded-lg overflow-auto backdrop:bg-black/80"
      >
        <DemoKtxStats sha256={sha256} />
        <button
          onClick={close}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </Dialog>
    </>
  );
};
