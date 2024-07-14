import { getQtvPlayerAssets } from "@qwhub/pages/games/fte/assets.ts";
import {
  useFteController,
  useFteLoader,
} from "@qwhub/pages/games/fte/hooks.ts";
import { QTV_FTE_VERSION } from "@qwhub/pages/games/fte/meta.ts";
import { useEventListener } from "@qwhub/pages/games/hooks";
import { roundFloat } from "@qwhub/pages/games/math.ts";
import { LoadingSpinner } from "@qwhub/pages/games/player/FteDemoPlayer.tsx";
import { FtePlayerCanvas } from "@qwhub/pages/games/player/FtePlayerCanvas.tsx";
import { ResponsivePlayerInfo } from "@qwhub/pages/games/player/controls/PlayerInfo.tsx";
import { ResponsiveScoreBanner } from "@qwhub/pages/games/player/controls/ScoreBanner.tsx";
import { getAssetUrl } from "@qwhub/pages/games/services/cloudfront/cassets.ts";
import { MvdsvServer } from "@qwhub/pages/qtv/types.ts";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useElementSize } from "usehooks-ts";

export const FteQtvPlayer = () => {
  const [server, setServer] = useState<MvdsvServer | null>(null);
  const assets = getQtvPlayerAssets();
  const scriptPath = getAssetUrl(
    `fte/ftewebgl_qtv.js?version=${QTV_FTE_VERSION}`,
  );
  const { isLoadingAssets, isReady, assetStatus, isInitializing } =
    useFteLoader({ scriptPath, assets });
  const fte = useFteController();

  useEffect(() => {
    if (!fte || !server) {
      return;
    }

    connect(server.qtv_stream.url);
  }, [fte]);

  function connect(url: string) {
    if (!fte) {
      return;
    }

    fte.command("qtvplay", `tcp:${url}@wss://fteqtv.quake.world`);
  }

  useEventListener("hub.selectServer", ({ detail: server }) => {
    if (!server) {
      setServer(server);
    }
    connect(server.qtv_stream.url);
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
      <div id="FullscreenContent">
        <FtePlayerCanvas config={{ preset: "qtvPlayer" }} />

        {fte && (
          <>
            <ResponsivePlayerInfo scale={scale} preset="qtvPlayer" />
            <ResponsiveScoreBanner scale={scale} />
          </>
        )}
      </div>
      <div
        className={classNames(
          "absolute z-30 w-full h-full bg-black transition-opacity duration-700 pointer-events-none bg-cover",
          {
            "opacity-0": isReady,
          },
        )}
      >
        <div
          className="flex w-full h-full items-center justify-center"
          style={{
            background: "radial-gradient(circle at center, black 0, #0009 80%)",
          }}
        >
          <div className="flex items-center">
            <LoadingSpinner />
            <div className="animate-pulse text-gray-400">
              {isLoadingAssets && <>Loading assets ({assetStatus.progress}%)</>}
              {isInitializing && "Initializing.."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
