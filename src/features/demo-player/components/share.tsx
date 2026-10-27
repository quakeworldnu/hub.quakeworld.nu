import { faClose, faCopy, faShare } from "@fortawesome/free-solid-svg-icons";
import { type ChangeEvent, useEffect, useState } from "react";
import { useToggle } from "usehooks-ts";
import { Dialog } from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { btnPrimary, sizeLarge, sizeSmall } from "@/components/ui/theme";
import { toast } from "@/components/ui/toast";
import { useFteController } from "@/lib/fte/hooks";
import { useCurrentGameId } from "@/utils/game-url";
import { toQueryString } from "@/utils/query-string";
import { formatElapsed } from "@/utils/time";

export const ShareDemoButton = () => {
  const fte = useFteController();
  const gameId = useCurrentGameId();
  const [gameElapsedTime, setMatchElapsedTime] = useState<number>(0);
  const [useFrom, toggleUseFrom] = useToggle(false);
  const [isUsingAutotrack, setIsUsingAutotrack] = useState<boolean>(false);
  const [trackUserId, setTrackUserId] = useState<number | "">(0);
  const [url, setUrl] = useState<string>(getUrl());
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleOpenClick() {
    if (!fte) {
      return;
    }
    fte.pause();
    const currentTrackUserId = fte.getTrackUserid() || "";
    const currentIsUsingAutotrack = fte.isUsingAutotrack();
    setTrackUserId(currentTrackUserId);
    setMatchElapsedTime(Math.floor(fte.getMatchElapsedTime()));
    setIsUsingAutotrack(currentIsUsingAutotrack);

    // build the link from the current player state (state updates above apply on next render)
    const currentUrl = buildUrl(
      useFrom,
      currentIsUsingAutotrack,
      currentTrackUserId,
    );
    setUrl(currentUrl);
    copyToClipboardWithToast(currentUrl);
    setIsOpen(true);
  }

  function handleTrackChange(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "auto") {
      setIsUsingAutotrack(true);
      setTrackUserId(0);
    } else {
      setTrackUserId(Number.parseInt(e.target.value, 10));
      setIsUsingAutotrack(false);
    }
  }

  function copyToClipboardWithToast(text: string) {
    navigator.clipboard.writeText(text);
    toast("Link copied to clipboard");
  }

  function getUrl(): string {
    return buildUrl(useFrom, isUsingAutotrack, trackUserId);
  }

  function buildUrl(
    withFrom: boolean,
    withAutotrack: boolean,
    withTrackUserId: number | "",
  ): string {
    if (!fte) {
      return "";
    }

    const q: { [key: string]: string | number | undefined } = { gameId };

    if (withFrom) {
      q.from = Math.floor(fte.getDemoElapsedTime());
    }

    if (!withAutotrack) {
      q.track = withTrackUserId;
    }

    const baseUrl = window.location.href.split("?")[0];

    if (Object.keys(q).length > 0) {
      return `${baseUrl}?${toQueryString(q)}`;
    }

    return baseUrl;
  }

  useEffect(() => {
    setUrl(getUrl());
  }, [gameElapsedTime, useFrom, isUsingAutotrack, trackUserId]);

  if (!fte) {
    return;
  }

  return (
    <>
      <button
        type="button"
        className={`${btnPrimary} ${sizeLarge} md:mt-0 app-effect-fade-in`}
        onClick={handleOpenClick}
      >
        <FontAwesomeIcon
          icon={faShare}
          fixedWidth
          size="sm"
          className="mr-1.5"
        />
        Share
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        label="Share demo"
        className="animate-contentShow fixed top-1/2 left-1/2 m-0 max-h-[85vh] w-[90vw] max-w-[580px] -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-inherit p-6 space-y-5 rounded-xl backdrop:bg-black/70 backdrop:animate-overlayShow"
      >
        <h2 className="text-lg font-bold">Share demo</h2>
        <div className="text-sm space-y-3">
          <div className="border border-slate-600 bg-slate-800 p-2 text-xs select-all">
            <div className="flex items-center justify-between">
              <div className="max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                {url}
              </div>
              <button
                type="button"
                className={`${btnPrimary} ${sizeSmall}`}
                onClick={() => copyToClipboardWithToast(url)}
              >
                <FontAwesomeIcon icon={faCopy} fixedWidth className="mr-1" />
                Copy
              </button>
            </div>
          </div>
          <div className="flex text-sm gap-x-12">
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-1.5"
                  defaultChecked={useFrom}
                  onClick={toggleUseFrom}
                />{" "}
                Start at{" "}
                <span className="ml-1 font-mono">
                  {formatElapsed(gameElapsedTime)}
                </span>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <div>Track</div>
              <select
                className="bg-slate-700 text-white rounded p-1 text-sm"
                defaultValue={isUsingAutotrack ? "auto" : trackUserId}
                onChange={handleTrackChange}
              >
                <option value="auto">Autotrack</option>
                {fte.getParticipants().players.map((player) => (
                  <option key={player.userid} value={player.userid}>
                    {player.name_ascii}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 absolute top-2 right-3 flex h-6 w-6 items-center justify-center rounded-full border-slate-600"
          title="Close"
          onClick={() => setIsOpen(false)}
        >
          <FontAwesomeIcon icon={faClose} fixedWidth size="sm" />
        </button>
      </Dialog>
    </>
  );
};
