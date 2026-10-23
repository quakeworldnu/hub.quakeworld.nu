import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import { useFteController, useFteEvent } from "../games/fte/hooks";
import { CLIP_CHANGE_EVENT } from "../games/fte/player/clips/playlist";
import { FteDemoPlayer } from "../games/fte/player/FteDemoPlayer";
import { useEventListener } from "../games/hooks";
import { getInfo } from "../games/services/cloudfront/cdemos";
import { DemoInfo } from "../games/services/cloudfront/types";

const params = new URLSearchParams(window.location.search);
const playerWidth = params.get("width");
const playerHeight = params.get("height");

function postMessage(key: string, value: string | number | object) {
  window.parent.postMessage({ key, value }, "*");
}

export const App = () => {
  const [demo, setDemo] = useState<DemoInfo | null>(null);
  const fte = useFteController();

  useFteEvent("track", (e: CustomEvent) =>
    postMessage("track", e.detail.value),
  );

  useFteEvent("demo_setspeed", (e: CustomEvent) =>
    postMessage("set_speed", Number.parseInt(e.detail.value, 10)),
  );

  useFteEvent("demo_jump", (e: CustomEvent) =>
    postMessage("seek", Number.parseInt(e.detail.value, 10)),
  );

  useEventListener(CLIP_CHANGE_EVENT, (e: CustomEvent) =>
    postMessage("clip", e.detail),
  );

  useInterval(() => {
    if (!fte) {
      return;
    }
    postMessage("current_time", fte.getDemoElapsedTime());
  }, 100);

  useEffect(() => {
    async function init() {
      const demo_sha256 = params.get("demo_sha256");

      if (!demo_sha256) {
        return;
      }

      const demo = await getInfo(demo_sha256);
      setDemo(demo);
    }

    init();
  }, []);

  if (!demo) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        width: playerWidth ? `${playerWidth}px` : "100vw",
        height: playerHeight ? `${playerHeight}px` : "100vh",
      }}
    >
      <FteDemoPlayer demo={demo} mapName={demo.map} aspectRatio="auto" />
    </div>
  );
};
