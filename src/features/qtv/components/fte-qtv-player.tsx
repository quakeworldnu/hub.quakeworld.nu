import clsx from "clsx";
import { type RefObject, useRef, useState } from "react";
import {
  useBoolean,
  useCounter,
  useInterval,
  useResizeObserver,
} from "usehooks-ts";
import { FtePlayerCanvas } from "@/components/fte-player/fte-player-canvas";
import { GameClock } from "@/components/fte-player/game-clock";
import { Participants } from "@/components/fte-player/participants";
import { ResponsivePlayerInfo } from "@/components/fte-player/player-info";
import { ResponsiveTopBanner } from "@/components/fte-player/top-banner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { QtvEvent } from "@/features/qtv/events";
import { useEventListener } from "@/hooks/use-event-listener";
import { getAssetUrl } from "@/lib/cloudfront/assets";
import { getQtvPlayerAssets } from "@/lib/fte/assets";
import { useFteController, useFteLoader } from "@/lib/fte/hooks";
import { enableLogToEvents } from "@/lib/fte/log";
import { roundFloat } from "@/utils/math";
import { FteQtvPlayerControls } from "./fte-qtv-player-controls";
import { QtvServerSelectorOverlay } from "./qtv-server-selector";

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
