import { getQtvPlayerAssets } from "@qwhub/pages/games/fte/assets";
import { useFteController, useFteLoader } from "@qwhub/pages/games/fte/hooks";
import { enableLogToEvents } from "@qwhub/pages/games/fte/log.ts";
import { GameClock } from "@qwhub/pages/games/fte/player/controls/GameClock.tsx";
import { Participants } from "@qwhub/pages/games/fte/player/controls/Participants.tsx";
import { ResponsivePlayerInfo } from "@qwhub/pages/games/fte/player/controls/PlayerInfo";
import { ResponsiveTopBanner } from "@qwhub/pages/games/fte/player/controls/TopBanner.tsx";
import { FtePlayerCanvas } from "@qwhub/pages/games/fte/player/FtePlayerCanvas";
import { LoadingSpinner } from "@qwhub/pages/games/fte/player/LoadingSpinner.tsx";
import { useEventListener } from "@qwhub/pages/games/hooks";
import { roundFloat } from "@qwhub/pages/games/math";
import { getAssetUrl } from "@qwhub/pages/games/services/cloudfront/cassets";
import { QtvEvent } from "@qwhub/pages/qtv/events.ts";
import { FteQtvPlayerControls } from "@qwhub/pages/qtv/FteQtvPlayerControls.tsx";
import { QtvServerSelectorOverlay } from "@qwhub/pages/qtv/QtvServerSelector.tsx";
import clsx from "clsx";
import { type RefObject, useRef, useState } from "react";
import {
  useBoolean,
  useCounter,
  useInterval,
  useResizeObserver,
} from "usehooks-ts";

const DISCONNECT_TIMEOUT = 50; // ms

enableLogToEvents();

export function FteQtvPlayer({
  mapName,
  timelimit,
  fullscreen = false,
}: {
  mapName: string;
  timelimit: number;
  fullscreen?: boolean;
}) {
  const [lastKnownUrl, setLastKnownUrl] = useState("");
  const assets = getQtvPlayerAssets(mapName);
  const scriptPath = getAssetUrl("fte/versions/004/ftewebgl.js");
  const { isLoadingAssets, isReady, assetStatus, isInitializing } =
    useFteLoader({ scriptPath, assets });
  const fte = useFteController();

  function connect(url: string) {
    if (!fte) {
      return;
    }

    fte.command("disconnect");
    window.setTimeout(() => {
      fte.command("closemenu");
      fte.command("qtvplay", `tcp:${url}@wss://fteqtv.quake.world`);
    }, DISCONNECT_TIMEOUT);
  }

  function reconnect() {
    if (lastKnownUrl) {
      connect(lastKnownUrl);
    }
  }

  useEventListener("fte.event.qtv_disconnect", reconnect);
  useEventListener(QtvEvent.SelectServer, ({ detail: selectedServer }) => {
    connect(selectedServer.qtv_stream.url);
    setLastKnownUrl(selectedServer.qtv_stream.url);
  });

  const playerRef = useRef<HTMLDivElement>(null);
  // usehooks-ts types predate react 19 refs (RefObject<T | null>)
  const { width } = useResizeObserver({
    ref: playerRef as RefObject<HTMLDivElement>,
    box: "border-box",
  });
  const defaultWidth = 1400;
  const scale = roundFloat((width ?? 0) / defaultWidth, 2);

  return (
    <div
      id="ftePlayer"
      className={clsx("relative w-full h-full bg-black", {
        "max-h-[75vh] aspect-video": !fullscreen,
        "min-h-screen max-h-full": fullscreen,
      })}
      ref={playerRef}
    >
      <div>
        <FtePlayerCanvas config={{ preset: "qtvPlayer" }} />

        {fte && (
          <>
            <ResponsivePlayerInfo scale={scale} />
            <ResponsiveTopBanner scale={scale}>
              <Participants />
              <QtvPlayerGameClock timelimit={timelimit} />
            </ResponsiveTopBanner>
          </>
        )}
      </div>
      <QtvServerSelectorOverlay />
      <div
        className={clsx(
          "absolute flex z-30 w-full h-full bg-black transition-opacity duration-1000 pointer-events-none items-center justify-center",
          {
            "opacity-0": isReady,
          },
        )}
      >
        <div className="flex">
          <LoadingSpinner />
          {!isReady && (
            <div className="animate-pulse text-gray-400">
              {isLoadingAssets && <>Loading assets ({assetStatus.progress}%)</>}
              {isInitializing && "Initializing.."}
            </div>
          )}
        </div>
      </div>

      {fte && (
        <div className={"absolute z-30 bottom-0 w-full"}>
          <FteQtvPlayerControls />
        </div>
      )}
    </div>
  );
}

export function QtvPlayerGameClock({ timelimit }: { timelimit: number }) {
  const elapsed = useQtvElapsedTime(timelimit);

  if (0 === elapsed) {
    return null;
  }
  return <GameClock elapsed={elapsed} />;
}

function useQtvElapsedTime(timelimit: number): number {
  const {
    value: isStarted,
    setFalse: stop,
    setTrue: start,
  } = useBoolean(false);
  const { count, increment, setCount, reset: resetCount } = useCounter(0);

  function reset() {
    stop();
    resetCount();
  }

  function startAt(duration: number) {
    if (!isStarted) {
      start();
    }

    if (duration >= 0) {
      setCount(duration);
    }
  }

  useEventListener("fte.event.qtv_play", reset);
  useEventListener("fte.event.qtv_disconnect", reset);
  useEventListener("game.match_begin", () => startAt(0));
  useEventListener("game.match_end", stop);
  useEventListener("game.remaining_seconds", (e: CustomEvent) =>
    startAt(60 * timelimit - Number.parseInt(e.detail, 10)),
  );
  useEventListener("game.overtime_minutes", () => startAt(60 * timelimit));
  useInterval(increment, isStarted ? 1000 : null);

  return count;
}
