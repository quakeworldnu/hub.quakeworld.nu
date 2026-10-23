import clsx from "clsx";
import { type RefObject, useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { FtePlayerCanvas } from "@/components/fte-player/fte-player-canvas";
import { GameClock } from "@/components/fte-player/game-clock";
import { Participants } from "@/components/fte-player/participants";
import { ResponsivePlayerInfo } from "@/components/fte-player/player-info";
import { ResponsiveTopBanner } from "@/components/fte-player/top-banner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ClipPlaylistProvider } from "@/features/demo-player/clips/clip-playlist";
import { useClipPlayback } from "@/features/demo-player/clips/use-clip-playback";
import { useUpdateInterval } from "@/hooks/use-update-interval";
import { getAssetUrl } from "@/lib/cloudfront/assets";
import { getDownloadUrl } from "@/lib/cloudfront/demos";
import { DemoInfo } from "@/lib/cloudfront/types";
import { getDemoPlayerAssets } from "@/lib/fte/assets";
import { useFteController, useFteLoader } from "@/lib/fte/hooks";
import { getMapshotCssUrl } from "@/utils/mapshots";
import { roundFloat } from "@/utils/math";
import { FteDemoPlayerControls } from "./fte-demo-player-controls";

type FteDemoPlayerProps = {
  demo: DemoInfo;
  mapName: string;
  aspectRatio?: "auto" | "video";
};

export const FteDemoPlayer = (props: FteDemoPlayerProps) => {
  return (
    <ClipPlaylistProvider>
      <DemoPlayer {...props} />
    </ClipPlaylistProvider>
  );
};

const DemoPlayer = ({
  demo,
  mapName,
  aspectRatio = "video",
}: FteDemoPlayerProps) => {
  useClipPlayback();
  const assets = getDemoPlayerAssets(getDownloadUrl(demo.sha256), mapName);
  const scriptPath = getAssetUrl("fte/versions/004/ftewebgl.js");
  const isQwleague = (demo.server?.hostname ?? "").includes(".qwleague.com");
  const countdownDuration = isQwleague ? 15 : 10;
  const { isLoadingAssets, isReady, assetStatus, isInitializing } =
    useFteLoader({
      scriptPath,
      assets,
      demoDuration: demo.demo_duration,
      countdownDuration,
    });
  const fte = useFteController();

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
        "aspect-video": aspectRatio === "video",
      })}
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
        className={clsx(
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
