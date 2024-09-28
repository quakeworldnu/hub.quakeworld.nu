import { getQtvPlayerAssets } from "@qwhub/pages/games/fte/assets";
import { useFteController, useFteLoader } from "@qwhub/pages/games/fte/hooks";
import { enableLogToEvents } from "@qwhub/pages/games/fte/log.ts";
import { QTV_FTE_VERSION } from "@qwhub/pages/games/fte/meta";
import { useEventListener } from "@qwhub/pages/games/hooks";
import { roundFloat } from "@qwhub/pages/games/math";
import { LoadingSpinner } from "@qwhub/pages/games/player/FteDemoPlayer";
import { FtePlayerCanvas } from "@qwhub/pages/games/player/FtePlayerCanvas";
import { ResponsivePlayerInfo } from "@qwhub/pages/games/player/controls/PlayerInfo";
import { ResponsiveScoreBanner } from "@qwhub/pages/games/player/controls/ScoreBanner";
import { getAssetUrl } from "@qwhub/pages/games/services/cloudfront/cassets";
import { Controls } from "@qwhub/pages/qtv/Controls";
import { QtvServerSelectorOverlay } from "@qwhub/pages/qtv/QtvServerSelector.tsx";
import { QtvEvent } from "@qwhub/pages/qtv/events.ts";
import classNames from "classnames";
import { useState } from "react";
import { useElementSize } from "usehooks-ts";

const DISCONNECT_TIMEOUT = 50; // ms

enableLogToEvents();

export function FteQtvPlayer({ mapName }: { mapName: string }) {
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
            <ResponsiveScoreBanner scale={scale} showClock={false} />
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
          <Controls />
        </div>
      )}
    </div>
  );
}
