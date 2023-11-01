import {
  Autotrack,
  ControlSource,
  DemoPlayback,
  FteModule,
  PlayerInfo,
} from "./types.ts";

export function fteEvent(name: string, detail: object) {
  const event = new CustomEvent(`fte.${name}`, { detail });
  window.dispatchEvent(event);
}

export class FteController {
  _controlSource = ControlSource.USER;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  _module: FteModule;
  _volume = 0.0;
  _demoTotalTime = 0.0;
  _lastVolume = 0.0;
  _maxVolume = 0.2;
  _last_demo_setspeed = 100;
  _demo_setspeed = 100;
  _cl_splitscreen = 0;
  _cl_autotrack: string = Autotrack.ON;

  static _instance: FteController | null = null;

  static createInstace(module: FteModule, demoTotalTime: number | null) {
    if (FteController._instance === null) {
      const fte = new FteController(module);
      fte.mute();
      fte.setDemoTotalTime(demoTotalTime || 600);
      FteController._instance = fte;
    }

    return FteController._instance;
  }

  static getInstance() {
    return FteController._instance;
  }

  constructor(module: FteModule) {
    if (FteController._instance) {
      return FteController._instance;
    }

    console.log("#################### FteController.new");
    this._module = module;
    this._lastVolume = this._volume;

    return this;
  }

  get module() {
    return this._module;
  }

  command(command: string, value?: undefined | string | number) {
    try {
      const commandStr = value !== undefined ? `${command} ${value}` : command;
      this.module.execute(commandStr);
      this.dispatchEvent(command, { value });
    } catch (e) {
      console.log("fte command error: " + e);
    }
  }

  dispatchEvent(name: string, detail: object) {
    fteEvent(name, { ...detail, source: this._controlSource });
  }

  getDemoElapsedTime(): number {
    try {
      return this.module.getDemoElapsedTime();
    } catch (e) {
      return 0;
    }
  }

  getDemoTotalTime(): number {
    return this._demoTotalTime;
  }

  setDemoTotalTime(value: number) {
    this._demoTotalTime = value;
  }

  getDemoGameStartTime(): number {
    return this._demoTotalTime % 60;
  }

  getGameElapsedTime(): number {
    return this.getDemoElapsedTime() - this.getDemoGameStartTime();
  }

  getGameTotalTime(): number {
    return this.getDemoTotalTime() - this.getDemoGameStartTime();
  }

  getPlayers(): PlayerInfo[] {
    try {
      return this.module.getPlayerInfo();
    } catch (e) {
      return [];
    }
  }

  getTrackUserid() {
    try {
      const seatIndex = 0; // index of screen in splitscreen
      return this.module.getTrackUserid(seatIndex);
    } catch (e) {
      return -1;
    }
  }

  // demo playback
  demoJump(demoTime: number) {
    const newDemoTime = clamp(
      Math.floor(demoTime),
      0,
      1.1 + this.getDemoTotalTime(),
    );
    const currentDemoTime = this.getDemoElapsedTime();
    const lastTrack = this.getTrackUserid();
    const lastAutotrackEnabled = this.isUsingAutotrack();

    this.command("demo_jump", newDemoTime);

    // restore track on backwards jump
    if (newDemoTime < currentDemoTime) {
      const restoreTrack = () => {
        if (lastAutotrackEnabled) {
          this.enableAutotrack();
        } else {
          this.track(lastTrack);
        }
      };

      setTimeout(restoreTrack, 20);
    }
  }

  demo_setspeed() {
    return this._demo_setspeed;
  }

  setSpeed(speed: number) {
    this._last_demo_setspeed = this._demo_setspeed;
    this._demo_setspeed = parseFloat(`${speed}`);
    this.command("demo_setspeed", this._demo_setspeed);
  }

  play() {
    if (this.isPaused()) {
      this.setSpeed(this._last_demo_setspeed);
    }
  }

  isPlaying() {
    return this._demo_setspeed > 0;
  }

  isPaused() {
    return !this.isPlaying();
  }

  pause() {
    if (this.isPlaying()) {
      this.setSpeed(0);
    }
  }

  togglePlay() {
    this.isPlaying() ? this.pause() : this.play();
  }

  // track
  cl_autotrack() {
    return this._cl_autotrack;
  }

  isUsingAutotrack() {
    return this._cl_autotrack === Autotrack.ON;
  }

  setAutotrack(value: string) {
    this._cl_autotrack = value;
    this.command("cl_autotrack", this._cl_autotrack);
  }

  enableAutotrack() {
    this.setAutotrack(Autotrack.ON);
  }

  disableAutotrack() {
    this.setAutotrack(Autotrack.OFF);
  }

  toggleAutotrack() {
    if (this.isUsingAutotrack()) {
      this.disableAutotrack();
    } else {
      this.enableAutotrack();
    }
  }

  track(userid: number | string) {
    if (this.isUsingAutotrack()) {
      this.disableAutotrack();
    }
    this.command("track", Number(userid));
  }

  trackNext() {
    this.disableAutotrack();
    this.command("+jump");

    setTimeout(() => {
      this.command("-jump");
    }, 50);
  }

  // volume
  mute() {
    this._lastVolume = this._volume;
    this.setVolume(0);
  }

  isMuted() {
    return 0 === this._volume;
  }

  unmute() {
    if (this._lastVolume <= this.maxVolume() / 100) {
      this._lastVolume = this.maxVolume() / 10;
    }

    this.setVolume(this._lastVolume);
  }

  toggleMute() {
    if (this.isMuted()) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  volume() {
    return this._volume;
  }

  maxVolume() {
    return this._maxVolume;
  }

  setVolume(value: number | string) {
    this._lastVolume = this._volume;
    this._volume = parseFloat(`${value}`);
    this.command("volume", this._volume);
  }

  // split screen
  cl_splitscreen() {
    return this._cl_splitscreen;
  }

  toggleSplitscreen() {
    this.setSplitscreen(this._cl_splitscreen === 0 ? 1 : 0);
  }

  setSplitscreen(value: number) {
    this._cl_splitscreen = value;
    this.command("cl_splitscreen", this._cl_splitscreen);

    if (this._cl_splitscreen > 0 && this.isPaused()) {
      this.command("demo_nudge 1");
    }
  }

  // group
  applyGroupPlayback(playback: DemoPlayback) {
    this._controlSource = ControlSource.GROUP;

    // track
    if (playback.track !== this.getTrackUserid()) {
      // console.log("### set track", playback.track);
      this.track(playback.track);
    }

    if (playback.cl_autotrack !== this._cl_autotrack) {
      // console.log("### set autotrack", playback.cl_autotrack);
      this.setAutotrack(playback.cl_autotrack);
    }

    // speed
    if (playback.demo_setspeed !== this.demo_setspeed()) {
      console.log("### set speed", playback.demo_setspeed);
      this.setSpeed(playback.demo_setspeed);
    }

    // demo jump
    const timeDelta = Math.abs(playback.demo_jump - this.getDemoElapsedTime());
    const shouldDemoJump = timeDelta > 3;

    if (shouldDemoJump) {
      console.log("### demo jump", playback.demo_jump);
      this.demoJump(playback.demo_jump);
    }

    this._controlSource = ControlSource.USER;
  }
}

// captureCommandOutput(command: string) {
//   const originalLog = console.log;
//   const messages: string[] = [];
//
//   function captureLog() {
//     messages.push(`${arguments[0]}`);
//   }
//
//   console.log = captureLog;
//
//   try {
//     this.command(command);
//   } catch (e) {
//     // ignore
//   }
//
//   console.log = originalLog;
//   return messages;
// }

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
