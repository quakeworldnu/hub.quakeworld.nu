import { faClose, faCopy, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import { type ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { query } from "urlcat";
import { useCopyToClipboard, useToggle } from "usehooks-ts";
import { useFteController } from "../fte/hooks.ts";
import { useCurrentGameId } from "../hooks.ts";
import { formatElapsed } from "../time.ts";
import { btnPrimary, sizeLarge, sizeSmall } from "../ui/theme.ts";

export const ShareDemoButton = () => {
  const fte = useFteController();
  const gameId = useCurrentGameId();
  const [gameElapsedTime, setMatchElapsedTime] = useState<number>(0);
  const [useFrom, toggleUseFrom] = useToggle(false);
  const [isUsingAutotrack, setIsUsingAutotrack] = useState<boolean>(false);
  const [trackUserId, setTrackUserId] = useState<number | "">(0);
  const [url, setUrl] = useState<string>(getUrl());
  const [, copyToClipboard] = useCopyToClipboard();

  function handleOpenClick() {
    if (!fte) {
      return;
    }
    fte.pause();
    setTrackUserId(fte.getTrackUserid() || "");
    setMatchElapsedTime(Math.floor(fte.getMatchElapsedTime()));
    setIsUsingAutotrack(fte.isUsingAutotrack());
    setUrl(getUrl());
    copyToClipboardWithToast();
  }

  function handleTrackChange(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "auto") {
      setIsUsingAutotrack(true);
      setTrackUserId(0);
    } else {
      setTrackUserId(Number.parseInt(e.target.value));
      setIsUsingAutotrack(false);
    }
  }

  function copyToClipboardWithToast() {
    copyToClipboard(url);
    toast("Link copied to clipboard", { type: "success" });
  }

  function getUrl(): string {
    if (!fte) {
      return "";
    }

    const base = window.location.href.split("?")[0];
    if (!gameElapsedTime) {
      return base;
    }

    const q: { [key: string]: string | number | undefined } = { gameId };

    if (useFrom) {
      q.from = Math.floor(fte.getDemoElapsedTime());
    }

    if (!isUsingAutotrack) {
      q.track = trackUserId;
    }

    return `${base}?${query(q)}`;
  }

  useEffect(() => {
    setUrl(getUrl());
  }, [gameElapsedTime, useFrom, isUsingAutotrack, trackUserId]);

  if (!fte) {
    return;
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild onClick={handleOpenClick}>
        <button
          className={`${btnPrimary} ${sizeLarge} md:mt-0 app-effect-fade-in`}
        >
          <FontAwesomeIcon
            icon={faShare}
            fixedWidth
            size="sm"
            className="mr-1.5"
          />
          Share
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="z-50 data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[580px] -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-6 space-y-5 rounded-xl">
          <Dialog.Title className="text-lg font-bold">Share demo</Dialog.Title>
          <div className="text-sm space-y-3">
            <div className="border border-slate-600 bg-slate-800 p-2 text-xs select-all">
              <div className="flex items-center justify-between">
                <div className="max-w-[80%] whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {url}
                </div>
                <button
                  className={`${btnPrimary} ${sizeSmall}`}
                  onClick={copyToClipboardWithToast}
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
                  {fte.getPlayers().map((player) => (
                    <option key={player.userid} value={player.userid}>
                      {player.getNamePlain()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              className="text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 absolute top-2 right-3 flex h-6 w-6 items-center justify-center rounded-full border-slate-600"
              title="Close"
            >
              <FontAwesomeIcon icon={faClose} fixedWidth size="sm" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
