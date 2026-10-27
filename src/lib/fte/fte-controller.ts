import {
  Autotrack,
  type ClientState,
  ControlSource,
  type DemoInfo,
  type FTEC,
  type FteCommandEvent,
  type FteModule,
  type Participants,
} from "./types";

export function fteEvent(name: string, detail: FteCommandEvent["detail"]) {
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
  // @ts-expect-error
  private _module: FteModule;
  private _countdownDuration = 10.0;
  private _demoDuration = 610.0;
  private _demoInfo: DemoInfo | null = null;
  private _lastVolume = 0.0;
  private _maxVolume = 0.2;

  private static _instance: FteController | null = null;

  static createInstace(
    module: FteModule,
    demoDuration: number | null,
    countdownDuration: number | null = null,
  ) {
    if (FteController._instance === null) {
      const fte = new FteController(module);
      fte.mute();
      fte.setDemoDuration(demoDuration || 610);
      fte.setCountdownDuration(countdownDuration || 10);
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

  dispatchEvent(name: string, detail: { value?: string | number }) {
    fteEvent(name, { ...detail, source: this._controlSource });
  }

  getClientState(): ClientState {
    return this.module.getClientState();
  }

  // last known demo info, the engine returns null until it's available (e.g. while loading)
  getDemoInfo(): DemoInfo | null {
    try {
      this._demoInfo = this.getClientState().getDemoInfo() ?? this._demoInfo;
    } catch {
      // keep last value
    }

    return this._demoInfo;
  }

  getDemoElapsedTime(): number {
    return (this.getDemoInfo()?.elapsed_ms ?? 0) / 1000;
  }

  // from the engine when available, else the database duration
  getDemoDuration(): number {
    const info = this.getDemoInfo();
    return info ? info.total_ms / 1000 : this._demoDuration;
  }

  setDemoDuration(value: number) {
    this._demoDuration = value;
  }

  // from the engine when available, else the hostname based guess
  getCountdownDuration(): number {
    const info = this.getDemoInfo();
    return info && info.countdown_ms > 0
      ? info.countdown_ms / 1000
      : this._countdownDuration;
  }

  setCountdownDuration(value: number) {
    this._countdownDuration = value;
  }

  getMatchElapsedTime(): number {
    return this.getDemoElapsedTime() - this.getCountdownDuration();
  }

  // seconds since the match started (qtv), tracked by the engine. null before the match
  getStreamMatchElapsedTime(): number | null {
    try {
      const ms = this.getClientState().getMatchElapsed();
      return ms === null ? null : ms / 1000;
    } catch {
      return null;
    }
  }

  getMatchDuration(): number {
    return this.getDemoDuration() - this.getCountdownDuration();
  }

  getParticipants(): Participants {
    try {
      return this.module.getParticipants();
    } catch {
      return { players: [], teams: [] };
    }
  }

  getTrackUserid(): number | null {
    try {
      const userid = this.module.getTrackedUserid();
      return userid >= 0 ? userid : null;
    } catch {
      return null;
    }
  }

  // demo playback
  // demo-relative seconds. the engine clamps to the demo length, ignores jumps
  // shorter than 1 second and keeps speed and tracked player on rewind
  demoJump(demoTime: number) {
    try {
      this.module.command("demo_jump", demoTime);
      this.dispatchEvent("demo_jump", { value: Math.floor(demoTime) });
    } catch (e) {
      console.log(`fte command error: ${e}`);
    }
  }

  seekForward(delta: number) {
    this.demoJump(this.getDemoElapsedTime() + delta);
  }

  seekBackward(delta: number) {
    this.demoJump(this.getDemoElapsedTime() - delta);
  }

  // state is read from the engine: binds and gestures change it without the hub

  // percent (cl_demospeed is a fraction)
  getDemoSpeed(): number {
    const speed = Number.parseFloat(this.module.getCvar("cl_demospeed"));
    return Number.isNaN(speed) ? 0 : Math.round(speed * 100);
  }

  setDemoSpeed(speed: number) {
    this.command("demo_setspeed", speed);
  }

  isPlaying() {
    return this.getDemoSpeed() > 0;
  }

  isPaused() {
    return !this.isPlaying();
  }

  // the engine restores the last positive speed on resume
  togglePlay() {
    this.command("demo_toggle_pause");
  }

  play() {
    if (this.isPaused()) {
      this.togglePlay();
    }
  }

  pause() {
    if (this.isPlaying()) {
      this.togglePlay();
    }
  }

  // track
  getAutotrack(): string {
    try {
      return this.module.getAutotrackMode();
    } catch {
      return Autotrack.OFF;
    }
  }

  isUsingAutotrack() {
    return this.getAutotrack() !== Autotrack.OFF;
  }

  enableAutotrack() {
    this.command("autotrack", Autotrack.ON);
  }

  // the camera stays on the currently tracked player
  disableAutotrack() {
    this.command("autotrack", Autotrack.OFF);
  }

  toggleAutotrack() {
    this.command("autotrack_toggle");
  }

  // userid or player name, also switches autotrack off
  track(player: number | string) {
    const userid = Number(player);

    if (`${player}`.trim() !== "" && Number.isInteger(userid)) {
      this.command("track_userid", userid);
    } else {
      this.command("track", `"${`${player}`.replaceAll('"', "")}"`);
    }
  }

  trackNext() {
    this.command("track_next");
  }

  trackPrev() {
    this.command("track_prev");
  }

  // volume
  mute() {
    this._lastVolume = this.getVolume();
    this.setVolume(0);
  }

  isMuted() {
    return 0 === this.getVolume();
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

  getVolume(): number {
    const volume = Number.parseFloat(this.module.getCvar("volume"));
    return Number.isNaN(volume) ? 0 : volume;
  }

  getMaxVolume() {
    return this._maxVolume;
  }

  setVolume(value: number | string) {
    this._lastVolume = this.getVolume();
    this.command("volume", Number.parseFloat(`${value}`));
  }

  // console
  toggleConsole() {
    this.command("toggleconsole");
  }

  isConsoleOpen(): boolean {
    try {
      return this.module.isConsoleOpen();
    } catch {
      return false;
    }
  }
}

if (import.meta.vitest) {
  const { describe, expect, test } = import.meta.vitest;

  const demoInfo = (info: Partial<DemoInfo>): DemoInfo => ({
    format: "mvd",
    elapsed_ms: 0,
    total_ms: 0,
    timelimit_ms: 0,
    countdown_ms: 0,
    overtime_ms: 0,
    intermission_ms: 0,
    pov_user_id: 0,
    is_single_pov: false,
    ...info,
  });

  function controller(getDemoInfo: () => DemoInfo | null) {
    const module = {
      getClientState: () => ({ getDemoInfo }),
    } as unknown as FteModule;
    const fte = new FteController(module);
    fte.setDemoDuration(610);
    fte.setCountdownDuration(15);
    return fte;
  }

  describe("demo info", () => {
    test("no info: fallback values", () => {
      const fte = controller(() => null);
      expect(fte.getDemoElapsedTime()).toBe(0);
      expect(fte.getDemoDuration()).toBe(610);
      expect(fte.getCountdownDuration()).toBe(15);
    });

    test("info replaces fallback values", () => {
      const fte = controller(() =>
        demoInfo({
          elapsed_ms: 42_500,
          total_ms: 1_210_000,
          countdown_ms: 10_000,
        }),
      );
      expect(fte.getDemoElapsedTime()).toBe(42.5);
      expect(fte.getDemoDuration()).toBe(1210);
      expect(fte.getCountdownDuration()).toBe(10);
      expect(fte.getMatchElapsedTime()).toBe(32.5);
      expect(fte.getMatchDuration()).toBe(1200);
    });

    test("no countdown found: fallback countdown", () => {
      const fte = controller(() => demoInfo({ total_ms: 600_000 }));
      expect(fte.getCountdownDuration()).toBe(15);
    });

    test("keeps last value when the engine returns null", () => {
      let info: DemoInfo | null = demoInfo({
        elapsed_ms: 5000,
        total_ms: 9000,
      });
      const fte = controller(() => info);
      expect(fte.getDemoElapsedTime()).toBe(5);
      info = null;
      expect(fte.getDemoElapsedTime()).toBe(5);
      expect(fte.getDemoDuration()).toBe(9);
    });

    test("engine error: fallback values", () => {
      const fte = controller(() => {
        throw new Error("not loaded");
      });
      expect(fte.getDemoElapsedTime()).toBe(0);
      expect(fte.getDemoDuration()).toBe(610);
    });
  });
}
