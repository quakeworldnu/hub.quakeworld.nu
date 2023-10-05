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
  _lastVolume = 0.0;
  _maxVolume = 0.2;
  _last_demo_setspeed = 100;
  _demo_setspeed = 100;
  _cl_autotrack = AUTOTRACK_ON;
  _cache = {
    timelimit: null,
    map: null,
    matchTotalTime: null,
    demoTotalTime: null,
    demoMatchStartTime: null,
  };

  static _instance = null;

  static getInstance(module) {
    if (FteController._instance === null) {
      FteController._instance = new FteController(module);
      FteController._instance.mute();
    }

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

  // todo: fix
  getDemoTotalTime() {
    return 10 + 60 * 20;

    return this.getCachedValue(
      "demoTotalTime",
      this.module.getDemoTotalTime,
      10 + 60 * 20,
    );
  }

  getDemoMatchStartTime() {
    return this.getCachedValue(
      "demoMatchStartTime",
      this.module.getDemoMatchStartTime,
      0,
    );
  }

  getMatchElapsedTime() {
    try {
      return this.module.getMatchElapsedTime();
    } catch (e) {
      return 0;
    }
  }

  getMatchTotalTime() {
    return this.getCachedValue(
      "matchTotalTime",
      this.module.getMatchTotalTime,
      60 * 20,
    );
  }

  getMapName() {
    return this.getCachedValue("mapName", this.module.getMapName, "unknown");
  }

  getPlayers() {
    try {
      return this.module.getPlayerInfo();
    } catch (e) {
      return [];
    }
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
