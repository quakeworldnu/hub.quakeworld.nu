import {
  useCounter,
  useEffectOnce,
  useEventListener,
  useInterval,
  useScript,
} from "usehooks-ts";
import { useState } from "react";
import { withPrefix } from "./assets";
import { FteController } from "./fteController";

export function useFteLoader({ files }) {
  const scriptPath = withPrefix("/ftewebgl.js");
  const scriptStatus = useScript(scriptPath, { removeOnUnmount: true });
  const { count: loaded, increment } = useCounter(0);

  useEffectOnce(() => {
    window.Module = {
      canvas: document.getElementById("fteCanvas"),
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

  const totalAssets = Object.values(files).length;
  return {
    isReady: scriptStatus === "ready",
    isLoading: scriptStatus !== "ready",
    scriptStatus,
    assets: {
      total: totalAssets,
      loaded,
      progress: Math.round(100 * (loaded / totalAssets)),
    },
  };
}

export function useFteController() {
  const [fte, setFte] = useState(undefined);

  useInterval(
    () => {
      if (!fte && window.Module?.execute) {
        const instance = FteController.getInstance(window.Module);
        setFte(instance);
      }
    },
    fte ? null : 100,
  );

  return fte;
}

export function useFteEventBySource(eventName, source, callback) {
  useEventListener(`fte.${eventName}`, (e) => {
    if (e.detail.source === source) {
      callback(e);
    }
  });
}

export function useFteEvent(eventName, callback) {
  useEventListener(`fte.${eventName}`, callback);
}

export function useFteUpdateOnEvent(eventName) {
  const { increment } = useCounter(0);
  useFteEvent(eventName, increment);
}
