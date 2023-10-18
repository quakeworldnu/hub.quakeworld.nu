export function fteEvent(name, detail) {
  const event = new CustomEvent(`fte.${name}`, { detail });
  window.dispatchEvent(event);
}

const AUTOTRACK_ON = "stats";
const AUTOTRACK_OFF = "user";
const CONTROL_USER = "user";
const CONTROL_GROUP = "group";

export class FteController {
  _controlSource = CONTROL_USER;
  _module = null;
  _volume = 0.0;
  _demoTotalTime = 0.0;
  _lastVolume = 0.0;
  _maxVolume = 0.2;
  _last_demo_setspeed = 100;
  _demo_setspeed = 100;
  _cl_splitscreen = 0;
  _cl_autotrack = AUTOTRACK_ON;
  _cache = {
    timelimit: null,
    map: null,
    matchTotalTime: null,
    demoTotalTime: null,
    demoMatchStartTime: null,
  };

  static _instance = null;

  static createInstace(module, demoTotalTime) {
    if (FteController._instance === null) {
      const fte = new FteController(module);
      fte.mute();
      fte.setDemoTotalTime(demoTotalTime);
      fte.command("con_textsize 12");
      FteController._instance = fte;
    }

    return FteController._instance;
  }

  static getInstance() {
    return FteController._instance;
  }

  constructor(module) {
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

  command(command, value = undefined) {
    try {
      const commandStr = value !== undefined ? `${command} ${value}` : command;
      this.module.execute(commandStr);
      this.dispatchEvent(command, { value });
    } catch (e) {
      console.log("fte command error: " + e);
    }
  }

  dispatchEvent(name, detail) {
    fteEvent(name, { ...detail, source: this._controlSource });
  }

  captureCommandOutput(command) {
    const originalLog = console.log;
    const messages = [];

    function captureLog() {
      messages.push(arguments[0]);
    }

    console.log = captureLog;

    try {
      this.command(command);
    } catch (e) {
      // ignore
    }

    console.log = originalLog;
    return messages;
  }

  // exposed functions from fte
  getCachedValue(key, getter, defaultValue) {
    if (this._cache[key] !== null) {
      return this._cache[key];
    }

    try {
      this._cache[key] = getter();
      return this._cache[key];
    } catch (e) {
      return defaultValue;
    }
  }

  getDemoElapsedTime() {
    try {
      return this.module.getDemoElapsedTime();
    } catch (e) {
      return 0;
    }
  }

  getDemoTotalTime() {
    return this._demoTotalTime;
  }

  setDemoTotalTime(value) {
    this._demoTotalTime = value;
  }

  getDemoMatchStartTime() {
    return this._demoTotalTime % 60;
  }

  getMatchElapsedTime() {
    try {
      return this.module.getMatchElapsedTime();
    } catch (e) {
      return 0;
    }
  }

  getMatchTotalTime() {
    return this.getDemoTotalTime() - this.getDemoMatchStartTime();
  }

  getPlayers() {
    try {
      return this.module.getPlayerInfo();
    } catch (e) {
      return [];
    }
  }

  getMapName() {
    return this.getCachedValue("mapName", this.module.getMapName, "unknown");
  }

  getTimelimit() {
    if (this._cache.timelimit !== null) {
      return this._cache.timelimit;
    }

    const timelimit = this.module.getTimelimit();
    this._cache.timelimit = timelimit;

    try {
      return timelimit;
    } catch (e) {
      return 20;
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
  demoJump(demoTime) {
    const newDemoTime = Math.floor(demoTime);
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

  setSpeed(speed) {
    this._last_demo_setspeed = this._demo_setspeed;
    this._demo_setspeed = parseFloat(speed);
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
    return this._cl_autotrack === AUTOTRACK_ON;
  }

  setAutotrack(value) {
    this._cl_autotrack = value;
    this.command("cl_autotrack", this._cl_autotrack);
  }

  enableAutotrack() {
    this.setAutotrack(AUTOTRACK_ON);
  }

  disableAutotrack() {
    this.setAutotrack(AUTOTRACK_OFF);
  }

  toggleAutotrack() {
    if (this.isUsingAutotrack()) {
      this.disableAutotrack();
    } else {
      this.enableAutotrack();
    }
  }

  track(userid) {
    if (this.isUsingAutotrack()) {
      this.disableAutotrack();
    }
    this.command("track", userid);
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

  setVolume(value) {
    this._lastVolume = this._volume;
    this._volume = parseFloat(value);
    this.command("volume", this._volume);
  }

  // split screen
  cl_splitscreen() {
    return this._cl_splitscreen;
  }

  toggleSplitscreen() {
    this.setSplitscreen(this._cl_splitscreen === 0 ? 1 : 0);
  }

  setSplitscreen(value) {
    this._cl_splitscreen = value;
    this.command("cl_splitscreen", this._cl_splitscreen);

    if (this._cl_splitscreen > 0 && this.isPaused()) {
      this.command("demo_nudge 1");
    }
  }

  // group
  applyGroupPlayback(playback) {
    this._controlSource = CONTROL_GROUP;

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

    this._controlSource = CONTROL_USER;
  }
}
