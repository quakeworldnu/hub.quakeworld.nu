import * as playerStyle from "./fte.module.scss";
//  import { document, window } from "browser-monads";
import screenfull from "./screenfull";

import {
  getAssets,
  withPrefix,
} from "@qwhub/pages/demo_player/nano/components/assets";
import { createRef, useEffect, useState } from "react";
import {
  VolumeSlider,
  VolumeToggle,
} from "@qwhub/pages/demo_player/nano/components/Volume";
import {
  GameTime,
  PlayToggle,
  ToggleFullscreenButton,
  ToggleSlowMotionButton,
} from "@qwhub/pages/demo_player/nano/components/controls";

function fteCommand(command) {
  try {
    window.Module.execute(command);
  } catch (e) {
    console.log("fteCommand error: " + e);
  }
}

const defaulState = {
  loadProgress: 0,
  demo: null,

  gametime: 0,
  isPlaying: true,
  playbackSpeed: 100,
  targetSpeed: 100,
  targetSpeedArrivalTime: 100,
  volume: 0.1,
  volumeMuted: false,
  playerControlTimeout: 0,
  firstRefresh: true,
  numAssets: 0,
};

export const FteComponent = ({ demoFilename, map, demoUrl, duration }) => {
  const [state, setState] = useState(defaulState);
  const canvasRef = createRef();
  const playerRef = createRef();
  const refreshInterval = 15000;

  // const duration = secondsToString(duration);
  const easingTime = 1500.0;

  useEffect(() => {
    console.log("Mount");
    const assets = getAssets(demoUrl, map);
    setState({ ...state, numAssets: Object.keys(assets).length });

    const fteScript = document.createElement("script");
    fteScript.src = withPrefix("/ftewebgl.js");
    document.head.appendChild(fteScript);

    window.Module = {
      canvas: canvasRef.current,
      files: assets,
      setStatus: updateLoadProgress,
    };

    // screenfull.on("change", onResize);
    // window.addEventListener("resize", onResize);

    setInterval(onFteRefresh, refreshInterval);
  }, []);

  function updateLoadProgress(text) {
    const found = text.match(/.+ [(]([^/]+)\/([^)]+)[)]/);
    if (found && found.length === 3 && found[1] === found[2]) {
      setState({ ...state, loadProgress: state.loadProgress + 1 });
    }
  }

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

  function onCanvasClick(event) {
    switch (event.detail) {
      case 1:
        onPlayToggle();
        break;
      case 2:
        toggleFullscreen();
        break;
      default:
        break;
    }
  }

  function onPlayToggle() {
    if (state.isPlaying) {
      fteCommand("demo_setspeed 0");
      setState({ ...state, isPlaying: false });
    } else {
      fteCommand("demo_setspeed " + state.playbackSpeed);
      setState({ ...state, isPlaying: true });
    }
  }

  function onResize() {
    window.onresize();

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
    if (screenfull.isFullscreen) {
      screenfull.exit();
    } else {
      screenfull.request(playerRef.current);
      window.onresize();
    }
  }

  function onVolumeLevelChange(volume) {
    fteCommand(`volume ${volume}`);
    setState({ ...state, volume });
  }

  function onVolumeMuteToggle(volumeMuted) {
    setState({ ...state, volumeMuted });
    const volume = volumeMuted ? 0 : state.volume;
    fteCommand(`volume ${volume}`);
  }

  function onMouseMove() {
    // Avoid spamming the react state
    if (state.playerControlTimeout - Date.now() < 2500) {
      setState({ ...state, playerControlTimeout: Date.now() + 3000 });
      fteCommand("viewsize 120");
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

  function onDemoSeek(event) {
    const playerOffsetX = playerRef.current.offsetLeft;
    const playerWidth = playerRef.current.offsetWidth;
    const seekPosition =
      ((event.clientX - playerOffsetX) / playerWidth) * (duration + 10);
    fteCommand("demo_jump " + Math.floor(seekPosition));
    setState({ ...state, playerControlTimeout: Date.now() + 3000 });
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
  /*const loadProgress = state.numAssets
    ? Math.round(state.loadProgress / state.numAssets)
    : 0;

  console.log("loadProgress", loadProgress);*/

  return (
    <div
      ref={playerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onBlur={onMouseLeave}
      className={playerStyle.videoPlayer}
    >
      <div>
        <canvas
          id="canvas"
          ref={canvasRef}
          className={playerStyle.emscripten}
          onClick={onCanvasClick}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            cursor: state.playerControlTimeout ? "auto" : "none",
          }}
        />
        <div className={playerStyle.playerControls}>
          <div className={playerStyle.playerControlsShowInner}>
            <div className={playerStyle.videoProgress} onClick={onDemoSeek}>
              <div
                className={playerStyle.videoProgressFilled}
                style={{ width: gametimeProgress }}
              ></div>
            </div>

            <PlayToggle onClick={onPlayToggle} isPlaying={state.isPlaying} />

            <VolumeToggle
              isMuted={state.volumeMuted}
              volume={state.volume}
              onChange={onVolumeMuteToggle}
            />

            <VolumeSlider
              disabled={state.volumeMuted}
              volume={state.volume}
              onChange={onVolumeLevelChange}
            />

            <GameTime total={duration} elapsed={state.gametime} />

            <ToggleFullscreenButton onClick={toggleFullscreen} />

            <ToggleSlowMotionButton onClick={toggleSlowMotion} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FteComponent;
