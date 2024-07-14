import { getAssetUrl } from "@qwhub/pages/games/services/cloudfront/cassets.ts";
import { useEffect, useState } from "react";
import { useCounter, useInterval, useScript } from "usehooks-ts";
import { useEventListener } from "../hooks.ts";
import { FteController } from "./fteController.ts";
import type { FteAssets, FteModule, FtePreloadModule } from "./types.ts";

declare global {
  interface Window {
    Module: FteModule | FtePreloadModule;
  }
}

export function useFteLoader({
  scriptPath,
  assets,
  demoDuration = null,
}: {
  scriptPath: string;
  assets: FteAssets;
  demoDuration?: number | null;
}) {
  const scriptStatus = useScript(scriptPath, { removeOnUnmount: true });
  const { count: loaded, increment } = useCounter(0);
  const [fte, setFte] = useState<undefined | FteController>(undefined);

  useEffect(() => {
    const manifestUrl = getAssetUrl("fte/default.fmf");
    window.Module = {
      canvas: document.getElementById("fteCanvas") as HTMLCanvasElement,
      manifest: manifestUrl,
      arguments: ["-manifest", manifestUrl],
      files: assets,
      setStatus: (value) => {
        const assetRe = value.match(/.+ \((\d+)\/(\d+)\)/);
        const isLoadedAsset =
          assetRe && assetRe.length === 3 && assetRe[1] === assetRe[2];

        if (isLoadedAsset) {
          increment();
        }
      },
    };
  }, []);

  useInterval(
    () => {
      if (!fte && (window.Module as FteModule).getClientState) {
        const instance = FteController.createInstace(
          window.Module as FteModule,
          demoDuration,
        );
        setFte(instance);
      }
    },
    fte ? null : 100,
  );

  const totalAssets = Object.values(assets).length;
  const assetStatus = {
    total: totalAssets,
    loaded,
    progress: Math.round(100 * (loaded / totalAssets)),
  };
  const isLoadingScript = scriptStatus !== "ready";
  const isLoadingAssets = assetStatus.progress < 80;

  return {
    isLoadingAssets: assetStatus.progress < 80,
    isInitializing: !isLoadingAssets && !fte,
    isReady: fte,
    isLoading: !fte,
    isLoadingScript,
    scriptStatus,
    assetStatus,
  };
}

export function useFteController() {
  const [fte, setFte] = useState<undefined | FteController>(undefined);

  useInterval(
    () => {
      if (!fte) {
        const instance = FteController.getInstance();

        if (instance) {
          setFte(instance);
        }
      }
    },
    fte ? null : 100,
  );

  return fte;
}

// export function useFteEventBySource(
//   eventName: string,
//   source: string,
//   callback: (e: CustomEvent) => void,
// ) {
//   useEventListener(`fte.${eventName}`, (e: CustomEvent) => {
//     if (e.detail.source === source) {
//       callback(e);
//     }
//   });
// }

export function useFteEvent(
  eventName: string,
  callback: (e: CustomEvent) => void,
) {
  useEventListener(`fte.${eventName}`, callback);
}

export function useFteUpdateOnEvent(eventName: string) {
  const { increment } = useCounter(0);
  useFteEvent(eventName, increment);
}
