//  import { document, window } from "browser-monads";
import screenfull from "screenfull";
import { useCounter, useEffectOnce, useInterval, useScript } from "usehooks-ts";

import { withPrefix } from "@qwhub/pages/demo_player/DemoPlayer/components/assets";
import { createRef, useEffect, useState } from "react";
import { FteController } from "@qwhub/pages/demo_player/DemoPlayer/components/fteController";
import { demoUrlToFilename } from "@qwhub/pages/demo_player/demoUtil";
import { FteControls } from "@qwhub/pages/demo_player/DemoPlayer/components/fteControls";
import {
  ToggleFullscreenButton,
  ToggleSlowMotionButton,
} from "@qwhub/pages/demo_player/DemoPlayer/components/controls";

const defaulState = {
  playbackSpeed: 100,
  targetSpeed: 100,
  targetSpeedArrivalTime: 100,
  playerControlTimeout: 0,
  firstRefresh: true,
};

const easingTime = 1500.0;
const refreshInterval = 500;
const canvasRef = createRef();
const playerRef = createRef();

const vlog = (arg1 = "", arg2 = "", arg3 = "") => {
  console.log("############################", arg1, arg2, arg3);
};

export const FteComponent = ({ files, demoUrl, duration }) => {
  const [state, setState] = useState(defaulState);
  const [fte, setFte] = useState(null);
  const { count: numberOfLoadedAssets, increment: incrementLoadedAssets } =
    useCounter(0);
  const fteScriptStatus = useScript(withPrefix("/ftewebgl.js"), {
    removeOnUnmount: true,
  });
  const [fteReady, setFteReady] = useState(false);

  useEffect(() => {
    vlog("fteScriptStatus", fteScriptStatus);
  }, [fteScriptStatus]);

  useEffect(() => {
    setFte(new FteController(window.Module));
  }, [fteReady]);

  useEffectOnce(() => {
    window.Module = {
      canvas: canvasRef.current,
      files,
      setStatus: function (value) {
        if (value.includes("Running..")) {
          setTimeout(() => {
            setFteReady(true);
          }, 500);
        }

        const assetRe = value.match(/.+ \((\d+)\/(\d+)\)/);
        const isLoadedAsset =
          assetRe && assetRe.length === 3 && assetRe[1] === assetRe[2];

        if (isLoadedAsset) {
          incrementLoadedAssets();
        }
      },
    };
  });

  useInterval(onFteRefresh, fteReady ? refreshInterval : null);

  function onFteRefresh() {
    if (!fte) {
      return;
    }

    const gametime = fte.getGametime();

    if (
      state.playerControlTimeout !== 0 &&
      state.playerControlTimeout < Date.now()
    ) {
      fte.command("viewsize 100");
      setState({ ...state, playerControlTimeout: 0 });
    }

    if (state.firstRefresh && gametime > 0) {
      onResize();

      // Workaround for not being able to bind an alias to TAB key for RQ demos
      const demoFilename = demoUrlToFilename(demoUrl);
      if (/.+.dem/.test(demoFilename)) {
        fte.command("bind tab +showteamscores");
      }

      setState({ ...state, firstRefresh: false });
    }

    if (state.loop && gametime >= state.initialPosition + state.loop) {
      fte.command("demo_jump " + state.initialPosition);
    }

    if (
      state.playbackSpeed !== 0 &&
      state.playbackSpeed !== state.targetSpeed
    ) {
      const now = performance.now();
      if (now >= state.targetSpeedArrivalTime) {
        fte.command("demo_setspeed " + state.targetSpeed);
        setState({ ...state, playbackSpeed: state.targetSpeed });
      } else {
        const progress = (state.targetSpeedArrivalTime - now) / easingTime;
        const easing = 1 - progress * (2 - progress);

        if (state.playbackSpeed > state.targetSpeed) {
          const speed =
            state.playbackSpeed -
            (state.playbackSpeed - state.targetSpeed * 1.0) * easing;
          fte.command("demo_setspeed " + speed);
          setState({ ...state, playbackSpeed: speed });
        } else {
          const speed =
            state.playbackSpeed +
            (state.targetSpeed - state.playbackSpeed * 1.0) * easing;
          fte.command("demo_setspeed " + speed);
          setState({ ...state, playbackSpeed: speed });
        }
      }
    }

    // This is a hack, seeking causes player to switch
    if (gametime > 0 && state.initialPlayer) {
      fte.command("track " + state.initialPlayer); // cmd: users for userId
    }
  }

  function onResize() {
    if (!fte) {
      return;
    }

    const width =
      window.screen.orientation.angle === 0
        ? playerRef.current.clientWidth
        : playerRef.current.clientHeight;

    // Arbitrary scaling ratio based on 4 * DPI for 4k fullscreen.
    fte.command(
      "vid_conautoscale " +
        Math.ceil(4.0 * window.devicePixelRatio * (width / 3840.0)).toString(),
    );
  }

  function toggleFullscreen() {
    if (!screenfull.isEnabled) {
      return;
    }

    if (screenfull.isFullscreen) {
      screenfull.exit();
    } else {
      screenfull.request(playerRef.current);
    }
  }

  function toggleSlowMotion(event) {
    if (!state.playbackSpeed === 0) {
      if (state.targetSpeed === 100) {
        setState({
          ...state,
          targetSpeed: 20,
          targetSpeedArrivalTime: event.timeStamp + easingTime,
        });
      } else {
        setState({
          ...state,
          targetSpeed: 100,
          targetSpeedArrivalTime: event.timeStamp + easingTime,
        });
      }
    }
  }

  const totalAssets = Object.keys(files).length;

  return (
    <div
      ref={playerRef}
      className={"fte w-full h-full relative bg-black aspect-video"}
    >
      <div>
        <canvas
          id="fteCanvas"
          ref={canvasRef}
          className={"absolute w-full h-full"}
          onClick={() => (fte ? fte.togglePlay() : null)}
          onDoubleClick={toggleFullscreen}
          onTouchStart={() => (fte ? fte.command("+scoreboard") : null)}
          onTouchEnd={() => (fte ? fte.command("-scoreboard") : null)}
          style={{
            cursor: state.playerControlTimeout ? "auto" : "none",
          }}
        />

        <div
          className={"flex absolute bottom-0 w-full z-10 transition-opacity"}
        >
          {fte && (
            <div className={"flex w-full flex-wrap bg-black/60"}>
              <div className="w-full p-4">
                <pre>
                  {JSON.stringify(
                    {
                      ...state,
                      duration,
                      totalAssets,
                      loadedAssets: numberOfLoadedAssets,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>

              <FteControls fte={fte} duration={duration} />

              <div className="ml-auto">
                <ToggleSlowMotionButton onClick={toggleSlowMotion} />
                <ToggleFullscreenButton
                  onClick={toggleFullscreen}
                  isFullscreen={screenfull.isFullscreen}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FteComponent;
