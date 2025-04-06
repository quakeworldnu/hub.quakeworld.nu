import { getQtvPlayerAssets } from "@qwhub/pages/games/fte/assets";
import { useFteController, useFteLoader } from "@qwhub/pages/games/fte/hooks";
import { enableLogToEvents } from "@qwhub/pages/games/fte/log.ts";
import { useEventListener } from "@qwhub/pages/games/hooks";
import { roundFloat } from "@qwhub/pages/games/math";
import { FtePlayerCanvas } from "@qwhub/pages/games/player/FtePlayerCanvas";
import { LoadingSpinner } from "@qwhub/pages/games/player/LoadingSpinner.tsx";
import { GameClock } from "@qwhub/pages/games/player/controls/GameClock.tsx";
import { Participants } from "@qwhub/pages/games/player/controls/Participants.tsx";
import { ResponsivePlayerInfo } from "@qwhub/pages/games/player/controls/PlayerInfo";
import { ResponsiveTopBanner } from "@qwhub/pages/games/player/controls/TopBanner.tsx";
import { getAssetUrl } from "@qwhub/pages/games/services/cloudfront/cassets";
import { FteQtvPlayerControls } from "@qwhub/pages/qtv/FteQtvPlayerControls.tsx";
import { QtvServerSelectorOverlay } from "@qwhub/pages/qtv/QtvServerSelector.tsx";
import { QtvEvent } from "@qwhub/pages/qtv/events.ts";
import classnames from "classnames";
import { useState } from "react";
import {
  useBoolean,
  useCounter,
  useElementSize,
  useInterval,
} from "usehooks-ts";

const DISCONNECT_TIMEOUT = 50; // ms

enableLogToEvents();

export function FteQtvPlayer({
  mapName,
  timelimit,
  fullscreen = false,
}: { mapName: string; timelimit: number; fullscreen?: boolean }) {
  const [lastKnownUrl, setLastKnownUrl] = useState("");
  const assets = getQtvPlayerAssets(mapName);
  const scriptPath = getAssetUrl("fte/versions/003/ftewebgl.js");
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

  const [playerRef, { width }] = useElementSize();
  const defaultWidth = 1400;
  const scale = roundFloat(width / defaultWidth, 2);

  return (
    <div
      id="ftePlayer"
      className={classnames("relative w-full h-full bg-black", {
        "max-h-[75vh] aspect-video": !fullscreen,
        "min-h-[100vh] max-h-full": fullscreen,
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
        className={classnames(
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
    startAt(60 * timelimit - Number.parseInt(e.detail)),
  );
  useEventListener("game.overtime_minutes", () => startAt(60 * timelimit));
  useInterval(increment, isStarted ? 1000 : null);

  return count;
}
