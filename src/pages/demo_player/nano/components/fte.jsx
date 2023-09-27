import * as React from "react";
import * as playerStyle from "./fte.module.scss";
import screenfull from "./screenfull";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeLow,
  faVolumeHigh,
  faVolumeXmark,
  faVolumeOff,
  faExpand,
  faGauge,
} from "@fortawesome/free-solid-svg-icons";
import Progressbar from "./progressbar";

import { window, document } from "browser-monads";
import {
  getAssets,
  withPrefix,
} from "@qwhub/pages/demo_player/nano/components/assets";
import { secondsToString } from "@qwhub/pages/demo_player/nano/components/time";

const easingTime = 1500.0;

function fteCommand(command) {
  if (window.Module) {
    window.Module.execute(command);
  }
}

class FteComponent extends React.Component {
  state = {
    loadProgress: 0,
    demo: null,
    refreshInterval: 250,
    gametime: 0,
    playing: true,
    playbackSpeed: 100,
    targetSpeed: 100,
    targetSpeedArrivalTime: 100,
    volume: Math.sqrt(0.05),
    volumeMuted: false,
    volumeIcon: faVolumeLow,
    playerControlTimeout: 0,
    firstRefresh: true,
    initialSpeed: null,
    initialPlayer: null,
    initialPosition: null,
  };

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.playerRef = React.createRef();
    this.duration = secondsToString(this.props.duration);
  }

  componentDidMount() {
    const baseUrl = this.props.demoBaseUrl;
    const demoUrl = `${baseUrl}/${this.props.directory}/${encodeURIComponent(
      this.props.demo,
    )}`;
    const assets = getAssets(demoUrl, this.props.map);
    this.setState({ numAssets: Object.keys(assets).length });

    window.Module = {
      canvas: this.canvasRef.current,
      files: assets,
      setStatus: this.updateLoadProgress.bind(this),
    };

    const fteScript = document.createElement("script");
    fteScript.src = withPrefix("/ftewebgl.js");
    document.head.appendChild(fteScript);

    screenfull.on("change", this.onResize.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));

    if (false) {
      const parts = window.location.hash.substring(1).split("&");
      for (let i = 0; i < parts.length; i++) {
        const kv = parts[i].split("=");
        if (kv.length !== 2) continue;
        switch (kv[0]) {
          case "player":
            this.setState({ initialPlayer: Number.parseInt(kv[1]) });
            break;
          case "speed":
            this.setState({ initialSpeed: Number.parseInt(kv[1]) });
            break;
          case "position":
            this.setState({ initialPosition: Number.parseInt(kv[1]) });
            break;
          case "loop":
            this.setState({ loop: Number.parseInt(kv[1]) });
            break;
        }
      }
    }

    setInterval(this.onFteRefresh.bind(this), this.state.refreshInterval);
  }

  updateLoadProgress(text) {
    const found = text.match(/.+ [(]([^/]+)\/([^)]+)[)]/);
    if (found && found.length === 3 && found[1] === found[2]) {
      this.setState({ loadProgress: this.state.loadProgress + 1 });
    }
  }

  onFteRefresh() {
    if (window.Module.gametime) {
      this.setState({ gametime: window.Module.gametime() });
    }
    if (
      this.state.playerControlTimeout !== 0 &&
      this.state.playerControlTimeout < Date.now()
    ) {
      fteCommand("viewsize 100");
      this.setState({ playerControlTimeout: 0 });
    }
    if (this.state.firstRefresh && this.state.gametime > 0) {
      this.onResize();

      // Workaround for not being able to bind an alias to TAB key for RQ demos
      if (/.+.dem/.test(this.props.demo)) {
        fteCommand("bind tab +showteamscores");
      }

      if (this.state.initialPlayer) {
        fteCommand("cl_autotrack off");
        fteCommand("autotrack off");
        fteCommand("track " + this.state.initialPlayer); // cmd: users for userId
      }
      if (this.state.initialSpeed) {
        fteCommand("demo_setspeed " + this.state.initialSpeed);
      }
      if (this.state.initialPosition) {
        fteCommand("demo_jump " + this.state.initialPosition);
      }
      this.setState({ firstRefresh: false });
    }

    if (
      this.state.loop &&
      this.state.gametime >= this.state.initialPosition + this.state.loop
    ) {
      fteCommand("demo_jump " + this.state.initialPosition);
    }

    if (
      this.state.playbackSpeed !== 0 &&
      this.state.playbackSpeed !== this.state.targetSpeed
    ) {
      const now = performance.now();
      if (now >= this.state.targetSpeedArrivalTime) {
        fteCommand("demo_setspeed " + this.state.targetSpeed);
        this.setState({ playbackSpeed: this.state.targetSpeed });
      } else {
        const progress = (this.state.targetSpeedArrivalTime - now) / easingTime;
        const easing = 1 - progress * (2 - progress);
        if (this.state.playbackSpeed > this.state.targetSpeed) {
          const speed =
            this.state.playbackSpeed -
            (this.state.playbackSpeed - this.state.targetSpeed * 1.0) * easing;
          fteCommand("demo_setspeed " + speed);
          this.setState({ playbackSpeed: speed });
        } else {
          const speed =
            this.state.playbackSpeed +
            (this.state.targetSpeed - this.state.playbackSpeed * 1.0) * easing;
          fteCommand("demo_setspeed " + speed);
          this.setState({ playbackSpeed: speed });
        }
      }
      const time = 2000 / performance.now();
    }

    // This is a hack, seeking causes player to switch
    if (this.state.gametime > 0 && this.state.initialPlayer) {
      fteCommand("track " + this.state.initialPlayer); // cmd: users for userId
    }
  }

  onCanvasClick(event) {
    switch (event.detail) {
      case 1:
        this.togglePlay();
        break;
      case 2:
        this.toggleFullscreen();
        break;
      default:
        break;
    }
  }

  togglePlay() {
    if (this.state.playing) {
      fteCommand("demo_setspeed 0");
      this.setState({ playing: false });
    } else {
      fteCommand("demo_setspeed " + this.state.playbackSpeed);
      this.setState({ playing: true });
    }
  }

  onResize() {
    window.onresize();

    const width =
      window.screen.orientation.angle === 0
        ? this.playerRef.current.clientWidth
        : this.playerRef.current.clientHeight;

    // Arbitrary scaling ratio based on 4 * DPI for 4k fullscreen.
    fteCommand(
      "vid_conautoscale " +
        Math.ceil(4.0 * window.devicePixelRatio * (width / 3840.0)).toString(),
    );
  }

  toggleFullscreen() {
    if (screenfull.isFullscreen) {
      screenfull.exit();
    } else {
      screenfull.request(this.playerRef.current);
      window.onresize();
    }
  }

  toggleMuted() {
    if (this.state.volumeMuted) {
      this.setState({ volumeMuted: false });
      const volume = this.state.volume * this.state.volume;
      fteCommand("volume " + volume);
    } else {
      this.setState({ volumeMuted: true });
      fteCommand("volume 0");
    }
  }

  onVolumeChange(e) {
    const volume = this.state.volume * this.state.volume;
    fteCommand("volume " + volume);
    this.setState({ volume: e.target.value });
    if (e.target.value === 0) {
      this.setState({ volumeIcon: faVolumeOff });
    } else if (e.target.value < 0.5) {
      this.setState({ volumeIcon: faVolumeLow });
    } else {
      this.setState({ volumeIcon: faVolumeHigh });
    }
  }

  onMouseMove() {
    // Avoid spamming the react state
    if (this.state.playerControlTimeout - Date.now() < 2500) {
      this.setState({ playerControlTimeout: Date.now() + 3000 });
      fteCommand("viewsize 120");
    }
  }

  onMouseLeave(event) {
    this.setState({ playerControlTimeout: Date.now() + 250 });
  }

  onTouchStart() {
    fteCommand("+scoreboard");
  }

  onTouchEnd() {
    fteCommand("-scoreboard");
  }

  onDemoSeek(event) {
    const playerOffsetX = this.playerRef.current.offsetLeft;
    const playerWidth = this.playerRef.current.offsetWidth;
    const seekPosition =
      ((event.clientX - playerOffsetX) / playerWidth) *
      (this.props.duration + 10);
    fteCommand("demo_jump " + Math.floor(seekPosition));
    this.setState({ playerControlTimeout: Date.now() + 3000 });
  }

  toggleSlowMotion(event) {
    if (!this.state.playbackSpeed == 0) {
      if (this.state.targetSpeed === 100) {
        this.setState({
          targetSpeed: 20,
          targetSpeedArrivalTime: event.timeStamp + easingTime,
        });
      } else {
        this.setState({
          targetSpeed: 100,
          targetSpeedArrivalTime: event.timeStamp + easingTime,
        });
      }
    }
  }

  render() {
    const gametime = secondsToString(this.state.gametime);
    const gametimeProgress =
      ((this.state.gametime / this.props.duration) * 100.0).toString() + "%";
    const loadProgress = this.state.numAssets
      ? Math.round(this.state.loadProgress / this.state.numAssets)
      : 0;
    return (
      <div
        ref={this.playerRef}
        onMouseMove={this.onMouseMove.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
        onBlur={this.onMouseLeave.bind(this)}
        className={playerStyle.videoPlayer}
      >
        <div className={playerStyle.curtain}>
          <div
            className={`${
              this.state.firstRefresh
                ? playerStyle.curtainLeft
                : playerStyle.curtainLeftOpen
            }`}
          >
            blue-hammer.png
          </div>
          <div
            className={`${
              this.state.firstRefresh
                ? playerStyle.curtainRight
                : playerStyle.curtainRightOpen
            }`}
          >
            red-flash.png
          </div>
          <canvas
            id="canvas"
            ref={this.canvasRef}
            className={playerStyle.emscripten}
            onClick={this.onCanvasClick.bind(this)}
            onTouchStart={this.onTouchStart.bind(this)}
            onTouchEnd={this.onTouchEnd.bind(this)}
            style={{
              cursor: this.state.playerControlTimeout ? "auto" : "none",
            }}
          />
          <div
            className={
              this.state.playerControlTimeout
                ? playerStyle.playerControlsShow
                : playerStyle.playerControls
            }
          >
            <div className={playerStyle.playerControlsShowInner}>
              <div
                className={playerStyle.videoProgress}
                onClick={this.onDemoSeek.bind(this)}
              >
                <div
                  className={playerStyle.videoProgressFilled}
                  style={{ width: gametimeProgress }}
                ></div>
              </div>
              <button
                className={playerStyle.playButton}
                title="Play"
                onClick={this.togglePlay.bind(this)}
              >
                <FontAwesomeIcon icon={this.state.playing ? faPause : faPlay} />
              </button>
              <button
                className={playerStyle.volumeButton}
                title="Volume"
                onClick={this.toggleMuted.bind(this)}
              >
                <FontAwesomeIcon
                  icon={
                    this.state.volumeMuted
                      ? faVolumeXmark
                      : this.state.volumeIcon
                  }
                />
              </button>
              <input
                type="range"
                className={playerStyle.volumeRange}
                min="0"
                max="1"
                step="0.01"
                value={this.state.volume}
                disabled={this.state.volumeMuted}
                onChange={this.onVolumeChange.bind(this)}
              />
              <div className={playerStyle.time}>
                <span id="demotime">
                  {gametime} / {this.duration}
                </span>
              </div>
              <button
                className={playerStyle.speedButton}
                onClick={this.toggleSlowMotion.bind(this)}
                style={{ color: "white" }}
              >
                <FontAwesomeIcon icon={faGauge} />
              </button>
              <button
                className={playerStyle.fullscreenButton}
                onClick={this.toggleFullscreen.bind(this)}
                style={{ color: "white" }}
              >
                <FontAwesomeIcon icon={faExpand} />
              </button>
            </div>
          </div>
        </div>
        <div
          className={playerStyle.progressWrapper}
          style={{ opacity: this.state.firstRefresh ? 1 : 0 }}
        >
          <div>{<Progressbar completed={loadProgress * 100} />}</div>
        </div>
      </div>
    );
  }
}

export default FteComponent;
