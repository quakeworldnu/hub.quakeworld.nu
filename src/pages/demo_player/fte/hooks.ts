import {
  useCounter,
  useEffectOnce,
  useEventListener,
  useInterval,
  useScript,
} from "usehooks-ts";
import { useState } from "react";
import { withPrefix } from "./assets.ts";
import { FteController } from "./fteController.ts";
import { FteModule } from "./types.ts";

type FtePreloadModule = {
  canvas: HTMLCanvasElement;
  files: object;
  setStatus: (value: string) => void;
};

declare global {
  interface Window {
    Module: FteModule | FtePreloadModule;
  }
}

export function useFteLoader({
  files,
  demoTotalTime,
}: {
  files: object;
  demoTotalTime: number | null;
}) {
  const scriptPath = withPrefix("/ftewebgl.js");
  const scriptStatus = useScript(scriptPath, { removeOnUnmount: true });
  const { count: loaded, increment } = useCounter(0);
  const [fte, setFte] = useState<undefined | FteController>(undefined);

  useEffectOnce(() => {
    window.Module = {
      canvas: document.getElementById("fteCanvas") as HTMLCanvasElement,
      files,
      setStatus: function (value) {
        const assetRe = value.match(/.+ \((\d+)\/(\d+)\)/);
        const isLoadedAsset =
          assetRe && assetRe.length === 3 && assetRe[1] === assetRe[2];

        if (isLoadedAsset) {
          increment();
        }
      },
    };
  });

  useInterval(
    () => {
      if (!fte && (window.Module as FteModule).execute) {
        const instance = FteController.createInstace(
          window.Module as FteModule,
          demoTotalTime,
        );
        setFte(instance);
      }
    },
    fte ? null : 100,
  );

  const totalAssets = Object.values(files).length;
  const assets = {
    total: totalAssets,
    loaded,
    progress: Math.round(100 * (loaded / totalAssets)),
  };
  const isLoadingScript = scriptStatus !== "ready";
  const isLoadingAssets = assets.progress < 80;

  return {
    isLoadingAssets: assets.progress < 80,
    isInitializing: !isLoadingAssets && !fte,
    isReady: fte,
    isLoading: !fte,
    isLoadingScript,
    scriptStatus,
    assets,
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

export function useFteEventBySource(
  eventName: string,
  source: string,
  callback: (e: CustomEvent) => void,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useEventListener(`fte.${eventName}`, (e: CustomEvent) => {
    if (e.detail.source === source) {
      callback(e);
    }
  });
}

export function useFteEvent(
  eventName: string,
  callback: (e: CustomEvent) => void,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useEventListener(`fte.${eventName}`, callback);
}

export function useFteUpdateOnEvent(eventName: string) {
  const { increment } = useCounter(0);
  useFteEvent(eventName, increment);
}
