import {
  useCounter,
  useEffectOnce,
  useEventListener,
  useScript,
} from "usehooks-ts";
import { useState } from "react";
import { withPrefix } from "./assets";
import { FteController, fteEvent } from "./fteController";

export function useFteLoader({ files }) {
  const scriptPath = withPrefix("/ftewebgl.js");
  const scriptStatus = useScript(scriptPath, { removeOnUnmount: true });
  const { count: loaded, increment } = useCounter(0);

  useEffectOnce(() => {
    window.Module = {
      canvas: document.getElementById("fteCanvas"),
      files,
      setStatus: function (value) {
        if (value.includes("Running..")) {
          setTimeout(() => {
            fteEvent("ready", { value: window.Module });
          }, 500);
        }

        const assetRe = value.match(/.+ \((\d+)\/(\d+)\)/);
        const isLoadedAsset =
          assetRe && assetRe.length === 3 && assetRe[1] === assetRe[2];

        if (isLoadedAsset) {
          increment();
        }
      },
    };
  });

  return {
    isReady: scriptStatus === "ready",
    scriptStatus,
    assets: {
      total: Object.values(files).length,
      loaded,
    },
  };
}

export function useFteController() {
  const [fte, setFte] = useState(undefined);

  useFteEvent("ready", (e) => {
    const module = e.detail.value;
    const instance = FteController.getInstance(module);
    setFte(instance);
  });

  useEffectOnce(() => {
    if (!fte && window.Module) {
      const instance = FteController.getInstance(window.Module);
      setFte(instance);
    }
  });

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
