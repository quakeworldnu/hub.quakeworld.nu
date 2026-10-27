import { useEffect, useRef, useState } from "react";
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

  useFteEvent("demo_jump", (e) =>
    postMessage("seek", Number.parseInt(String(e.detail.value), 10)),
  );

  useEventListener(CLIP_CHANGE_EVENT, (e) => postMessage("clip", e.detail));

  // speed and track change via hub controls, engine binds and gestures: post changes.
  // no initial values, and track only for explicit picks (autotrack off), as before
  const lastState = useRef<{ speed: number; track: number } | null>(null);

  useInterval(() => {
    if (!fte) {
      return;
    }
    postMessage("current_time", fte.getDemoElapsedTime());

    const speed = fte.getDemoSpeed();
    const track = fte.isUsingAutotrack() ? -1 : (fte.getTrackUserid() ?? -1);
    const last = lastState.current;
    lastState.current = { speed, track };

    if (!last) {
      return;
    }

    if (speed !== last.speed) {
      postMessage("set_speed", speed);
    }

    if (track !== last.track && track >= 0) {
      postMessage("track", track);
    }
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
