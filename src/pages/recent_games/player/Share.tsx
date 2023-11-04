import { ChangeEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCopy, faShare } from "@fortawesome/free-solid-svg-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { useFteController } from "../fte/hooks.ts";
import { formatElapsed } from "../time.ts";
import { useCopyToClipboard, useToggle } from "usehooks-ts";
import { useCurrentDemoId } from "../playlist/hooks.ts";
import { query } from "urlcat";

export const ShareDemoButton = () => {
  const fte = useFteController();
  const demoId = useCurrentDemoId();
  const [from, setFrom] = useState<number>(0);
  const [useFrom, toggleUseFrom] = useToggle(false);
  const [isUsingAutotrack, setIsUsingAutotrack] = useState<boolean>(false);
  const [trackUserId, setTrackUserId] = useState<number>(0);
  const [url, setUrl] = useState<string>(getUrl());
  const [_, copyToClipboard] = useCopyToClipboard();

  function handleOpenClick() {
    if (!fte) {
      return;
    }
    setTrackUserId(fte.getTrackUserid());
    setFrom(Math.floor(fte.getGameElapsedTime()));
    setIsUsingAutotrack(fte.isUsingAutotrack());
    setUrl(getUrl());
  }

  function handleTrackChange(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "auto") {
      setIsUsingAutotrack(true);
      setTrackUserId(0);
    } else {
      setTrackUserId(parseInt(e.target.value));
      setIsUsingAutotrack(false);
    }
  }

  function getUrl(): string {
    const base = window.location.href.split("?")[0];
    if (!from) {
      return base;
    }

    const q: { [key: string]: string | number | undefined } = { demoId };

    if (useFrom) {
      q.from = from;
    }

    if (!isUsingAutotrack) {
      q.track = trackUserId;
    }

    return `${base}?${query(q)}`;
  }

  useEffect(() => {
    setUrl(getUrl());
  }, [from, useFrom, isUsingAutotrack, trackUserId]);

  if (!fte) {
    return;
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild onClick={handleOpenClick}>
        <button className="flex text-sm items-center md:mt-0 py-2.5 px-4 rounded bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800">
          <FontAwesomeIcon icon={faShare} fixedWidth className="mr-1.5" />
          Share
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="z-50 data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[580px] -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-6 space-y-5 rounded-xl">
          <Dialog.Title className="text-lg font-bold">Share demo</Dialog.Title>
          <Dialog.Description className="text-sm my-3">
            <div className="border border-slate-600 bg-slate-800 p-2 text-xs select-all">
              <div className="flex items-center justify-between">
                <div className="max-w-[80%] whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {getUrl()}
                </div>
                <button
                  className="bg-blue-800 text-white hover:bg-blue-600 focus:shadow-green-400 inline-flex items-center justify-center rounded py-2 px-3 select-none"
                  onClick={() => copyToClipboard(url)}
                >
                  <FontAwesomeIcon icon={faCopy} fixedWidth className="mr-1" />
                  Copy
                </button>
              </div>
            </div>
          </Dialog.Description>
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-1.5"
                  defaultChecked={useFrom}
                  onClick={toggleUseFrom}
                />{" "}
                Start at{" "}
                <span className="ml-1 font-mono">{formatElapsed(from)}</span>
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
                  <option value={player.id}>{player.name}</option>
                ))}
              </select>
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
