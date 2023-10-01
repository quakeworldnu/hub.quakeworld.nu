import { useCounter, useEffectOnce, useScript } from "usehooks-ts";

import { withPrefix } from "./assets";
import { useState } from "react";
import { FteController } from "./fteController";
import { Controls } from "./Controls";

const vlog = (arg1 = "", arg2 = "", arg3 = "") => {
  console.log("############################", arg1, arg2, arg3);
};

function useFteAssetLoader(files) {
  const scriptPath = withPrefix("/ftewebgl.js");
  const scriptStatus = useScript(scriptPath, { removeOnUnmount: true });
  const { count: loaded, increment } = useCounter(0);
  const [fte, setFte] = useState(null);

  useEffectOnce(() => {
    window.Module = {
      canvas: document.getElementById("fteCanvas"),
      files,
      setStatus: function (value) {
        if (value.includes("Running..")) {
          setTimeout(() => {
            setFte(new FteController(window.Module));
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
    scriptStatus,
    assets: {
      total: Object.values(files).length,
      loaded,
    },
    fte,
  };
}

export const FtePlayer = ({ files, duration }) => {
  const { fte, assets } = useFteAssetLoader(files);

  return (
    <div
      id="ftePlayer"
      className={"w-full h-full relative bg-black aspect-video"}
    >
      <div>Loadiasdasdng: {JSON.stringify(assets, null, 2)}</div>
      <div>
        <canvas
          id="fteCanvas"
          className={"absolute w-full h-full"}
          /*onClick={fte.togglePlay}
          onDoubleClick={() => toggleFullscreen("ftePlayer")}
          onTouchStart={() => fte.command("+scoreboard")}
          onTouchEnd={() => fte.command("-scoreboard")}*/
        />

        <div
          className={"flex absolute bottom-0 w-full z-10 transition-opacity"}
        >
          {fte && (
            <div className={"flex w-full flex-wrap bg-black/60 mb-20"}>
              <Controls fte={fte} duration={duration} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FtePlayer;
