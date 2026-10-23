import { useEffect, useState } from "react";
import { useEventListener, useInterval } from "usehooks-ts";
import { CLIP_CHANGE_EVENT } from "@/features/demo-player/clips/clip-playlist";
import { FteDemoPlayer } from "@/features/demo-player/components/fte-demo-player";
import { getInfo } from "@/lib/cloudfront/demos";
import type { DemoInfo } from "@/lib/cloudfront/types";
import { useFteController, useFteEvent } from "@/lib/fte/hooks";

const params = new URLSearchParams(window.location.search);
const playerWidth = params.get("width");
const playerHeight = params.get("height");

function postMessage(key: string, value: unknown) {
  window.parent.postMessage({ key, value }, "*");
}

export const DemoPlayerPage = () => {
  const [demo, setDemo] = useState<DemoInfo | null>(null);
  const fte = useFteController();

  useFteEvent("track", (e) => postMessage("track", e.detail.value));

  useFteEvent("demo_setspeed", (e) =>
    postMessage("set_speed", Number.parseInt(String(e.detail.value), 10)),
  );

  useFteEvent("demo_jump", (e) =>
    postMessage("seek", Number.parseInt(String(e.detail.value), 10)),
  );

  useEventListener(CLIP_CHANGE_EVENT, (e) => postMessage("clip", e.detail));

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
