import { useEffect, useState } from "react";
import {
  useCounter,
  useEventListener,
  useInterval,
  useScript,
} from "usehooks-ts";
import { usePolledState } from "@/hooks/use-polled-value";
import { getAssetUrl } from "@/lib/cloudfront/assets";
import { toggleFullscreen } from "@/utils/fullscreen";
import { FteController } from "./fte-controller";
import type {
  FteAssets,
  FteCommandEvent,
  FteModule,
  FtePreloadModule,
} from "./types";

declare global {
  interface Window {
    Module: FteModule | FtePreloadModule;
  }
}

export function useFteLoader({
  scriptPath,
  assets,
  startCommand,
  demoDuration = null,
  countdownDuration = null,
}: {
  scriptPath: string;
  assets: FteAssets;
  startCommand?: string;
  demoDuration?: number | null;
  countdownDuration?: number | null;
}) {
  const scriptStatus = useScript(scriptPath, { removeOnUnmount: true });
  const { count: loaded, increment } = useCounter(0);
  const [fte, setFte] = useState<undefined | FteController>(undefined);
  // the api bindings exist before the engine has initialized (configs exec'd),
  // commands sent before that are lost
  const [isEngineReady, setIsEngineReady] = useState(false);

  useEffect(() => {
    // a config saved by `cfg_save` (fte.cfg) runs after the hub config and overrides it
    // (e.g. stale cl_download_mapsrc). the hub persists its settings in hub_settings.cfg
    try {
      localStorage.removeItem("id1/fte.cfg");
    } catch {
      // storage unavailable
    }

    const manifestUrl = getAssetUrl("fte/default.fmf");
    window.Module = {
      canvas: document.getElementById("fteCanvas") as HTMLCanvasElement,
      manifest: manifestUrl,
      // +commands run after config.cfg. one arg per token, fte quotes args with spaces
      arguments: [
        "-manifest",
        manifestUrl,
        ...(startCommand ? `+${startCommand}`.split(" ") : []),
      ],
      files: assets,
      onFteReady: () => setIsEngineReady(true),
      onHubRequest: (name) => {
        if (name === "fullscreen") {
          toggleFullscreen("ftePlayer");
        }
      },
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
      if (!fte && isEngineReady) {
        const instance = FteController.createInstace(
          window.Module as FteModule,
          demoDuration,
          countdownDuration,
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

export function useFteEvent(
  eventName: string,
  callback: (e: FteCommandEvent) => void,
) {
  // command names are dynamic, so these events aren't declared in WindowEventMap
  useEventListener(
    `fte.${eventName}` as keyof WindowEventMap,
    callback as (e: Event) => void,
  );
}

// engine state read on hub commands, and polled for changes made in the engine
// (binds, gestures). re-renders only when the value changes
export function useFtePolledValue<T>(
  eventName: string,
  read: () => T,
  key?: (value: T) => unknown,
): T {
  const [value, refresh] = usePolledState(read, 250, key);
  useFteEvent(eventName, refresh);
  return value;
}
