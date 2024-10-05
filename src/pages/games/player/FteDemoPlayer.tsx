import { DEMO_FTE_VERSION } from "@qwhub/pages/games/fte/meta.ts";
import { useUpdateInterval } from "@qwhub/pages/games/hooks.ts";
import { LoadingSpinner } from "@qwhub/pages/games/player/LoadingSpinner.tsx";
import { GameClock } from "@qwhub/pages/games/player/controls/GameClock.tsx";
import { Participants } from "@qwhub/pages/games/player/controls/Participants.tsx";
import { getAssetUrl } from "@qwhub/pages/games/services/cloudfront/cassets.ts";
import classNames from "classnames";
import { useElementSize } from "usehooks-ts";
import { getMapshotCssUrl } from "../../../services/mapshots.ts";
import { getDemoPlayerAssets } from "../fte/assets.ts";
import { useFteController, useFteLoader } from "../fte/hooks.ts";
import { roundFloat } from "../math.ts";
import { getDownloadUrl } from "../services/cloudfront/cdemos.ts";
import { DemoInfo } from "../services/cloudfront/types.ts";
import { FteDemoPlayerControls } from "./FteDemoPlayerControls.tsx";
import { FtePlayerCanvas } from "./FtePlayerCanvas.tsx";
import { useClipPlayback } from "./clips/hooks.ts";
import { ResponsivePlayerInfo } from "./controls/PlayerInfo.tsx";
import { ResponsiveTopBanner } from "./controls/TopBanner.tsx";

export const FteDemoPlayer = ({
  demo,
  mapName,
}: {
  demo: DemoInfo;
  mapName: string;
}) => {
  useClipPlayback();
  const assets = getDemoPlayerAssets(getDownloadUrl(demo.sha256), mapName);
  const scriptPath = getAssetUrl(`fte/ftewebgl.js?version=${DEMO_FTE_VERSION}`);
  const { isLoadingAssets, isReady, assetStatus, isInitializing } =
    useFteLoader({ scriptPath, assets, demoDuration: demo.demo_duration });
  const fte = useFteController();

  const [playerRef, { width }] = useElementSize();
  const defaultWidth = 1400;
  const scale = roundFloat(width / defaultWidth, 2);

  return (
    <div
      id="ftePlayer"
      className={"relative w-full h-full bg-black aspect-video"}
      ref={playerRef}
    >
      <div>
        <FtePlayerCanvas config={{ preset: "demoPlayer" }} />

        {fte && (
          <>
            <ResponsivePlayerInfo scale={scale} />
            <ResponsiveTopBanner scale={scale}>
              <Participants />
              <DemoLargeGameClock />
            </ResponsiveTopBanner>
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
        style={{
          backgroundImage: getMapshotCssUrl(`lg/${mapName}`),
        }}
      >
        <div
          className="flex w-full h-full items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at center, #0003 0, #0006 100%)",
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
        <div className={"absolute z-30 bottom-0 w-full"}>
          <FteDemoPlayerControls />
        </div>
      )}
    </div>
  );
};

function DemoLargeGameClock() {
  const fte = useFteController();
  useUpdateInterval(250);

  if (!fte || fte.getMatchElapsedTime() >= fte.getMatchDuration()) {
    return null;
  }

  return <GameClock elapsed={fte.getMatchElapsedTime()} />;
}
