import {
  Autotrack,
  ControlSource,
  DemoPlayback,
  FTEC,
  FteModule,
  PlayerInfo,
  TeamInfo,
} from "./types.ts";
import { clamp } from "../math.ts";

export function fteEvent(name: string, detail: object) {
  const event = new CustomEvent(`fte.${name}`, { detail });
  window.dispatchEvent(event);
}

declare global {
  interface Window {
    FTEC: FTEC;
  }
}

export class FteController {
  private _controlSource = ControlSource.USER;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private _module: FteModule;
  private _volume = 0.0;
  private _demoTotalTime = 0.0;
  private _lastVolume = 0.0;
  private _maxVolume = 0.2;
  private _lastDemoSpeed = 100;
  private _lastTrackUserId = -1;
  private _demoSpeed = 100;
  private _splitscreen = 0;
  private _autotrack: string = Autotrack.ON;
  private _consoleIsOpen = false;

  private static _instance: FteController | null = null;

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
    this._lastVolume = this.getVolume();

    return this;
  }

  get module() {
    return this._module;
  }

  command(command: string, value?: undefined | string | number) {
    try {
      const commandStr = value !== undefined ? `${command} ${value}` : command;
      window.FTEC.cbufadd(`${commandStr}\n`);
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

  getTrackedPlayer(): PlayerInfo | null {
    const userid = this.getTrackUserid();
    const players = this.getPlayers();
    const player = players.find((player) => player.id === userid);
    return player || null;
  }

  getTeams(): TeamInfo[] {
    const players = this.getPlayers();
    const teams: TeamInfo[] = [];

    players.forEach((player) => {
      const team = teams.find((team) => team.name === player.team);

      if (team) {
        team.players.push(player);
        team.frags += player.frags;
      } else {
        teams.push({
          name: player.team,
          frags: player.frags,
          players: [player],
        });
      }
    });

    // sort players by name
    teams.forEach((team) => {
      team.players.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }

        if (a.name > b.name) {
          return 1;
        }

        return 0;
      });
    });

    return teams;
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

    // skip shorter jumps than 1 second
    const currentDemoTime = Math.floor(this.getDemoElapsedTime());
    const delta = Math.abs(newDemoTime - currentDemoTime);

    if (delta < 1) {
      return;
    }

    const lastTrackUserId = this._lastTrackUserId;
    const hadAutotrackEnabled = this.isUsingAutotrack();
    const isRewind = newDemoTime < currentDemoTime;

    this.command("demo_jump", newDemoTime);

    // fix tracking
    const applyTrack = () => {
      if (hadAutotrackEnabled) {
        this.enableAutotrack();
      } else if (isRewind && this.getTrackUserid() !== lastTrackUserId) {
        this.track(lastTrackUserId);
      }
    };

    setTimeout(applyTrack, 50);
  }

  getDemoSpeed() {
    return this._demoSpeed;
  }

  setDemoSpeed(speed: number) {
    this._lastDemoSpeed = this._demoSpeed;
    this._demoSpeed = parseFloat(`${speed}`);
    this.command("demo_setspeed", this._demoSpeed);
  }

  play() {
    if (this.isPaused()) {
      this.setDemoSpeed(this._lastDemoSpeed);
    }
  }

  isPlaying() {
    return this.getDemoSpeed() > 0;
  }

  isPaused() {
    return !this.isPlaying();
  }

  pause() {
    if (this.isPlaying()) {
      this.setDemoSpeed(0);
    }
  }

  togglePlay() {
    this.isPlaying() ? this.pause() : this.play();
  }

  // track
  getAutotrack(): string {
    return this._autotrack;
  }

  isUsingAutotrack() {
    return this._autotrack === Autotrack.ON;
  }

  setAutotrack(value: string) {
    this._autotrack = value;
    this.command("cl_autotrack", this.getAutotrack());
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
    const userid_ = Number(userid);
    this._lastTrackUserId = userid_;
    this.command("track", userid_);
  }

  trackNext() {
    this.disableAutotrack();
    this.command("__track_next");
    this.command("wait");
    this._lastTrackUserId = this.getTrackUserid();
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
    if (this._lastVolume <= this.getMaxVolume() / 100) {
      this._lastVolume = this.getMaxVolume() / 10;
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

  getVolume() {
    return this._volume;
  }

  getMaxVolume() {
    return this._maxVolume;
  }

  setVolume(value: number | string) {
    this._lastVolume = this.getVolume();
    this._volume = parseFloat(`${value}`);
    this.command("volume", this.getVolume());
  }

  // split screen
  getSplitScreen() {
    return this._splitscreen;
  }

  toggleSplitscreen() {
    this.setSplitscreen(this.getSplitScreen() === 0 ? 1 : 0);
  }

  setSplitscreen(value: 0 | 1) {
    this._splitscreen = value;
    this.command("cl_splitscreen", this.getSplitScreen());

    if (this.getSplitScreen() > 0 && this.isPaused()) {
      this.command("demo_nudge 1");
    }
  }

  // console
  toggleConsole() {
    this.command("toggleconsole");
    this._consoleIsOpen = !this.isConsoleOpen();
  }

  isConsoleOpen() {
    return this._consoleIsOpen;
  }

  // group
  applyGroupPlayback(playback: DemoPlayback) {
    this._controlSource = ControlSource.GROUP;

    // track
    if (playback.track !== this.getTrackUserid()) {
      // console.log("### set track", playback.track);
      this.track(playback.track);
    }

    if (playback.cl_autotrack !== this._autotrack) {
      // console.log("### set autotrack", playback.cl_autotrack);
      this.setAutotrack(playback.cl_autotrack);
    }

    // speed
    if (playback.demo_setspeed !== this.getDemoSpeed()) {
      console.log("### set speed", playback.demo_setspeed);
      this.setDemoSpeed(playback.demo_setspeed);
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
