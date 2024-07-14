import { getQtvPlayerAssets } from "@qwhub/pages/games/fte/assets";
import { useFteController, useFteLoader } from "@qwhub/pages/games/fte/hooks";
import { QTV_FTE_VERSION } from "@qwhub/pages/games/fte/meta";
import { useEventListener } from "@qwhub/pages/games/hooks";
import { roundFloat } from "@qwhub/pages/games/math";
import { LoadingSpinner } from "@qwhub/pages/games/player/FteDemoPlayer";
import { FtePlayerCanvas } from "@qwhub/pages/games/player/FtePlayerCanvas";
import { ResponsivePlayerInfo } from "@qwhub/pages/games/player/controls/PlayerInfo";
import { ResponsiveScoreBanner } from "@qwhub/pages/games/player/controls/ScoreBanner";
import { getAssetUrl } from "@qwhub/pages/games/services/cloudfront/cassets";
import { Controls } from "@qwhub/pages/qtv/Controls";
import classNames from "classnames";
import { useElementSize } from "usehooks-ts";

export const FteQtvPlayer = () => {
  const assets = getQtvPlayerAssets();
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
    fte.command("qtvplay", `tcp:${url}@wss://fteqtv.quake.world`);
  }

  useEventListener("hub.selectServer", ({ detail: selectedServer }) => {
    connect(selectedServer.qtv_stream.url);
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
            <ResponsivePlayerInfo scale={scale} />
            <ResponsiveScoreBanner scale={scale} showClock={false} />
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

      {fte && (
        <div className={"absolute z-10 bottom-0 w-full"}>
          <Controls />
        </div>
      )}
    </div>
  );
};
