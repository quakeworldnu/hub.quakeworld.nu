import { clamp } from "../math.ts";
import { getPlayerColor, getPlayersMajorityColor } from "../quake_color.ts";
import {
  Autotrack,
  ClientState,
  ControlSource,
  FTEC,
  FteModule,
  Player,
  Team,
} from "./types.ts";

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
  private _countdownDuration = 10.0;
  private _demoDuration = 610.0;
  private _lastVolume = 0.0;
  private _maxVolume = 0.2;
  private _lastDemoSpeed = 100;
  private _lastTrackUserId: number | null = null;
  private _trackTarget: {
    demoTime: number;
    timeout: ReturnType<typeof setTimeout> | null;
  } = { demoTime: 0, timeout: null };
  private _demoSpeed = 100;
  private _autotrack: string = Autotrack.ON;
  private _consoleIsOpen = false;

  private static _instance: FteController | null = null;

  static createInstace(module: FteModule, demoDuration: number | null) {
    if (FteController._instance === null) {
      const fte = new FteController(module);
      fte.mute();
      fte.setDemoDuration(demoDuration || 610);
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
      console.log(`fte command error: ${e}`);
    }
  }

  dispatchEvent(name: string, detail: object) {
    fteEvent(name, { ...detail, source: this._controlSource });
  }

  getClientState(): ClientState {
    return this.module.getClientState();
  }

  getDemoElapsedTime(): number {
    try {
      return this.module.getDemoTime();
    } catch (e) {
      return 0;
    }
  }

  getDemoDuration(): number {
    return this._demoDuration;
  }

  setDemoDuration(value: number) {
    this._demoDuration = value;
  }

  getCountdownDuration(): number {
    return this._countdownDuration;
  }

  getMatchElapsedTime(): number {
    return this.getDemoElapsedTime() - this.getCountdownDuration();
  }

  getMatchDuration(): number {
    return this.getDemoDuration() - this.getCountdownDuration();
  }

  getPlayers(): Player[] {
    const players: Player[] = [];

    try {
      const state = this.getClientState();

      for (let i = 0; i < state.allocated_client_slots; i++) {
        const player = state.getPlayer(i);

        if (player.spectator !== 0 || "" === player.getNamePlain()) {
          continue;
        }

        player.topcolor = getPlayerColor(player.topcolor);
        player.bottomcolor = getPlayerColor(player.bottomcolor);
        players.push(player);
      }
    } catch (e) {
      return [];
    }
    players.sort((a, b) => a.getNamePlain().localeCompare(b.getNamePlain()));
    return players;
  }

  getTeams(): Team[] {
    const players = this.getPlayers();
    const teams: Team[] = [];

    for (const player of players) {
      const team = teams.find(
        (team) => team.namePlain === player.getTeamPlain(),
      );

      if (team) {
        team.players.push(player);
        team.frags += player.frags;
      } else {
        teams.push({
          name: player.getTeam(),
          namePlain: player.getTeamPlain(),
          frags: player.frags,
          players: [player],
          topcolor: 0,
          bottomcolor: 0,
        });
      }
    }

    for (const team of teams) {
      const { topcolor, bottomcolor } = getPlayersMajorityColor(team.players);
      team.topcolor = topcolor;
      team.bottomcolor = bottomcolor;
    }

    teams.sort((a, b) => a.namePlain.localeCompare(b.namePlain));

    return teams;
  }

  getTrackedPlayer(): Player | null {
    try {
      const seatIndex = 0; // index of screen in splitscreen
      return this.getClientState().getPlayerView(seatIndex).getTrackedPlayer();
    } catch (e) {
      return null;
    }
  }

  getTrackUserid(): number | null {
    const tracked_player = this.getTrackedPlayer();

    if (tracked_player) {
      return tracked_player.userid;
    }

    return null;
  }

  // demo playback
  demoJump(demoTime: number) {
    // clear existing track targets
    if (this._trackTarget.timeout) {
      clearTimeout(this._trackTarget.timeout);
    }

    // clamp demo time
    const newDemoTime = clamp(
      Math.floor(demoTime),
      0,
      1.1 + this.getDemoDuration(),
    );

    // skip shorter jumps than 1 second
    const currentDemoTime = Math.floor(this.getDemoElapsedTime());
    const delta = Math.abs(newDemoTime - currentDemoTime);

    if (delta < 1) {
      return;
    }

    this.command("demo_jump", newDemoTime);

    // restore playback on rewind (speed, track)
    if (newDemoTime < currentDemoTime) {
      this._trackTarget = {
        demoTime,
        timeout: setInterval(() => this._restorePlayback(), 25),
      };
    }
  }

  _restorePlayback() {
    const timeDiff = this.getDemoElapsedTime() - this._trackTarget.demoTime;
    const acceptableDiff = 1;

    if (!this._trackTarget.timeout || timeDiff > acceptableDiff) {
      return;
    }
    // disable new checks
    clearTimeout(this._trackTarget.timeout);

    // restore track
    if (this.isUsingAutotrack()) {
      this.enableAutotrack();
    } else if (this._lastTrackUserId) {
      this.track(this._lastTrackUserId);
    }

    // restore demo speed
    this.command("demo_setspeed", this._demoSpeed);
  }

  seekForward(delta: number) {
    this.demoJump(this.getDemoElapsedTime() + delta);
  }

  seekBackward(delta: number) {
    this.demoJump(this.getDemoElapsedTime() - delta);
  }

  getDemoSpeed() {
    return this._demoSpeed;
  }

  setDemoSpeed(speed: number) {
    this._lastDemoSpeed = this._demoSpeed;
    this._demoSpeed = Number.parseFloat(`${speed}`);
    this.command("demo_setspeed", this._demoSpeed);
  }

  play() {
    this.setDemoSpeed(this._lastDemoSpeed);
  }

  isPlaying() {
    return this.getDemoSpeed() > 0;
  }

  isPaused() {
    return !this.isPlaying();
  }

  pause() {
    this.setDemoSpeed(0);
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
    this._lastTrackUserId = this.getTrackUserid();
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
    this._trackByDelta(1);
  }

  trackPrev() {
    this._trackByDelta(-1);
  }

  _trackByDelta(delta: 1 | -1) {
    const current_userid = this.getTrackUserid();

    if (!current_userid) {
      return;
    }

    const all_userids = this.getPlayers().map((p) => p.userid);
    const current_index = all_userids.indexOf(current_userid);
    const new_index =
      (current_index + delta + all_userids.length) % all_userids.length;
    const new_userid = all_userids[new_index];
    this.track(new_userid);
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
    this._volume = Number.parseFloat(`${value}`);
    this.command("volume", this.getVolume());
  }

  // console
  toggleConsole() {
    this.command("toggleconsole");
    this._consoleIsOpen = !this.isConsoleOpen();
  }

  isConsoleOpen() {
    return this._consoleIsOpen;
  }

  //
  // // group
  // applyGroupPlayback(playback: DemoPlayback) {
  //   this._controlSource = ControlSource.GROUP;
  //
  //   // track
  //   if (playback.track !== this.getTrackUserid()) {
  //     // console.log("### set track", playback.track);
  //     this.track(playback.track);
  //   }
  //
  //   if (playback.cl_autotrack !== this._autotrack) {
  //     // console.log("### set autotrack", playback.cl_autotrack);
  //     this.setAutotrack(playback.cl_autotrack);
  //   }
  //
  //   // speed
  //   if (playback.demo_setspeed !== this.getDemoSpeed()) {
  //     this.setDemoSpeed(playback.demo_setspeed);
  //   }
  //
  //   // demo jump
  //   const timeDelta = Math.abs(playback.demo_jump - this.getDemoElapsedTime());
  //   const shouldDemoJump = timeDelta > 3;
  //
  //   if (shouldDemoJump) {
  //     this.demoJump(playback.demo_jump);
  //   }
  //
  //   this._controlSource = ControlSource.USER;
  // }
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
