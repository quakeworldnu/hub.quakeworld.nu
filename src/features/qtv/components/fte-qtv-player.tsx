import clsx from "clsx";
import { useEventListener } from "usehooks-ts";
import { FtePlayerCanvas } from "@/components/fte-player/fte-player-canvas";
import { FteSettings } from "@/components/fte-player/settings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { QtvEvent } from "@/features/qtv/events";
import { getFteBuildUrl, getQtvPlayerAssets } from "@/lib/fte/assets";
import { FteController } from "@/lib/fte/fte-controller";
import { useFteController, useFteLoader } from "@/lib/fte/hooks";
import { FteQtvPlayerControls } from "./fte-qtv-player-controls";

export function FteQtvPlayer({ mapName }: { mapName: string }) {
  const assets = getQtvPlayerAssets(mapName);
  const scriptPath = getFteBuildUrl("ftewebgl.js");
  const { isLoadingAssets, isReady, assetStatus, isInitializing } =
    useFteLoader({ scriptPath, assets });
  const fte = useFteController();

  function connect(url: string) {
    // the singleton, not `fte`: the select event can arrive before this
    // component's useFteController has picked up the instance
    const fte = FteController.getInstance();

    if (!fte) {
      return;
    }

    // qtvplay swaps streams once the new one is ready; no disconnect needed.
    fte.command("qtvplay", `tcp:${url}@wss://qtv.quake.world`);
  }

  // the engine reconnects by itself when a stream ends
  useEventListener(QtvEvent.SelectServer, ({ detail: selectedServer }) => {
    // only qtv servers are selectable
    if (!selectedServer.qtv_stream) {
      return;
    }
    connect(selectedServer.qtv_stream.url);
  });

  return (
    <div id="ftePlayer" className="relative w-full h-full bg-black">
      <div>
        <FtePlayerCanvas />
      </div>
      <FteSettings />
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
        <div id="ftePlayerControls" className={"absolute z-30 bottom-0 w-full"}>
          <FteQtvPlayerControls />
        </div>
      )}
    </div>
  );
}
