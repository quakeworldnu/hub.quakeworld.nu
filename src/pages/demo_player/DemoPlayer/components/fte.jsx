//  import { document, window } from "browser-monads";
import screenfull from "screenfull";
import { useCounter, useEffectOnce, useInterval, useScript } from "usehooks-ts";

import { withPrefix } from "@qwhub/pages/demo_player/DemoPlayer/components/assets";
import { createRef, useEffect, useState } from "react";
import {
  GameTime,
  PlayToggleButton,
  SeekBar,
  ToggleFullscreenButton,
  ToggleSlowMotionButton,
  VolumeSlider,
  VolumeToggle,
} from "@qwhub/pages/demo_player/DemoPlayer/components/controls";
import { FteController } from "@qwhub/pages/demo_player/DemoPlayer/components/fteController";
import { demoUrlToFilename } from "@qwhub/pages/demo_player/demoUtil";

function fteCommand(command) {
  try {
    window.Module.execute(command);
  } catch (e) {
    console.log("fteCommand error: " + e);
  }
}

const defaulState = {
  gametime: 0,
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
    if (window.Module.gametime) {
      setState({ ...state, gametime: window.Module.gametime() });
    }

    if (
      state.playerControlTimeout !== 0 &&
      state.playerControlTimeout < Date.now()
    ) {
      fteCommand("viewsize 100");
      setState({ ...state, playerControlTimeout: 0 });
    }

    if (state.firstRefresh && state.gametime > 0) {
      onResize();

      // Workaround for not being able to bind an alias to TAB key for RQ demos
      const demoFilename = demoUrlToFilename(demoUrl);
      if (/.+.dem/.test(demoFilename)) {
        fteCommand("bind tab +showteamscores");
      }

      setState({ ...state, firstRefresh: false });
    }

    if (state.loop && state.gametime >= state.initialPosition + state.loop) {
      fteCommand("demo_jump " + state.initialPosition);
    }

    if (
      state.playbackSpeed !== 0 &&
      state.playbackSpeed !== state.targetSpeed
    ) {
      const now = performance.now();
      if (now >= state.targetSpeedArrivalTime) {
        fteCommand("demo_setspeed " + state.targetSpeed);
        setState({ ...state, playbackSpeed: state.targetSpeed });
      } else {
        const progress = (state.targetSpeedArrivalTime - now) / easingTime;
        const easing = 1 - progress * (2 - progress);

        if (state.playbackSpeed > state.targetSpeed) {
          const speed =
            state.playbackSpeed -
            (state.playbackSpeed - state.targetSpeed * 1.0) * easing;
          fteCommand("demo_setspeed " + speed);
          setState({ ...state, playbackSpeed: speed });
        } else {
          const speed =
            state.playbackSpeed +
            (state.targetSpeed - state.playbackSpeed * 1.0) * easing;
          fteCommand("demo_setspeed " + speed);
          setState({ ...state, playbackSpeed: speed });
        }
      }
    }

    // This is a hack, seeking causes player to switch
    if (state.gametime > 0 && state.initialPlayer) {
      fteCommand("track " + state.initialPlayer); // cmd: users for userId
    }
  }

  function onResize() {
    const width =
      window.screen.orientation.angle === 0
        ? playerRef.current.clientWidth
        : playerRef.current.clientHeight;

    // Arbitrary scaling ratio based on 4 * DPI for 4k fullscreen.
    fteCommand(
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

  function onMouseMove() {
    // Avoid spamming the react state
    if (state.playerControlTimeout - Date.now() < 2500) {
      setState({ ...state, playerControlTimeout: Date.now() + 3000 });
    }
  }

  function onMouseLeave() {
    setState({ ...state, playerControlTimeout: Date.now() + 250 });
  }

  function onTouchStart() {
    fteCommand("+scoreboard");
  }

  function onTouchEnd() {
    fteCommand("-scoreboard");
  }

  function onDemoSeek(value) {
    setState({ ...state, playerControlTimeout: Date.now() + 3000 });
    fte.demoJump(value);
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

  const gametimeProgress =
    ((state.gametime / duration) * 100.0).toString() + "%";
  const totalAssets = Object.keys(files).length;

  return (
    <div
      ref={playerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onBlur={onMouseLeave}
      className={"fte w-full h-full relative bg-black aspect-video"}
    >
      <div>
        <canvas
          id="fteCanvas"
          ref={canvasRef}
          className={"absolute w-full h-full"}
          onClick={() => (fte ? fte.togglePlay() : null)}
          onDoubleClick={toggleFullscreen}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
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
                      gametimeProgress,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>

              <SeekBar
                onClick={onDemoSeek}
                max={duration}
                value={state.gametime}
              />

              <PlayToggleButton
                onClick={() => fte.togglePlay()}
                isPlaying={!fte.isPaused()}
              />

              <VolumeToggle
                isMuted={fte.isMuted()}
                volume={fte.volume()}
                onClick={() => fte.toggleMute()}
              />

              <VolumeSlider
                disabled={fte.isMuted()}
                volume={fte.volume()}
                onChange={(v) => fte.setVolume(v)}
              />

              <GameTime total={duration} elapsed={state.gametime} />

              <ToggleFullscreenButton
                onClick={toggleFullscreen}
                isFullscreen={screenfull.isFullscreen}
              />

              <ToggleSlowMotionButton onClick={toggleSlowMotion} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FteComponent;
