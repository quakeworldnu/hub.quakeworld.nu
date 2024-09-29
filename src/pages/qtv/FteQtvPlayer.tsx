import { getQtvPlayerAssets } from "@qwhub/pages/games/fte/assets";
import { useFteController, useFteLoader } from "@qwhub/pages/games/fte/hooks";
import { enableLogToEvents } from "@qwhub/pages/games/fte/log.ts";
import { QTV_FTE_VERSION } from "@qwhub/pages/games/fte/meta";
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
import classNames from "classnames";
import { useState } from "react";
import { useBoolean, useElementSize, useInterval } from "usehooks-ts";

const DISCONNECT_TIMEOUT = 50; // ms

enableLogToEvents();

export function FteQtvPlayer({
  mapName,
  timelimit,
}: { mapName: string; timelimit: number }) {
  const [lastKnownUrl, setLastKnownUrl] = useState("");
  const assets = getQtvPlayerAssets(mapName);
  const scriptPath = getAssetUrl(
    `fte/ftewebgl_qtv.js?version=${QTV_FTE_VERSION}`,
  );
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
      className={"relative w-full h-full max-h-[75vh] bg-black aspect-video"}
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
        className={classNames(
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

function QtvPlayerGameClock({ timelimit }: { timelimit: number }) {
  const elapsed = useQtvElapsedTime(timelimit);

  if (undefined === elapsed) {
    return null;
  }
  return <GameClock elapsed={elapsed} />;
}

function useQtvElapsedTime(timelimit: number): number | undefined {
  const {
    value: isMatchStarted,
    setFalse: stopMatch,
    setTrue: startMatch,
  } = useBoolean(false);
  const [elapsed, setElapsed] = useState<number | undefined>(undefined);

  useEventListener("fte.event.qtv_play", reset);
  useEventListener("fte.event.qtv_disconnect", reset);

  function reset() {
    stopMatch();
    setElapsed(undefined);
  }

  useEventListener("game.match_begin", () => {
    startMatch();
    setElapsed(0);
  });
  useEventListener("game.match_end", stopMatch);
  useEventListener("game.remaining_time", (e: CustomEvent) => {
    if (isMatchStarted) {
      return;
    }

    startMatch();
    setElapsed(60 * timelimit - e.detail);
  });

  useInterval(
    () => {
      if (elapsed !== undefined) {
        setElapsed(elapsed + 1);
      }
    },
    isMatchStarted ? 1000 : null,
  );

  if (undefined === elapsed) {
    return undefined;
  } else {
    return Math.min(elapsed, 60 * timelimit);
  }
}
