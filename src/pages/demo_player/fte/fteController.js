export function fteEvent(name, detail) {
  const event = new CustomEvent(`fte.${name}`, { detail });
  window.dispatchEvent(event);
}

export class FteController {
  emitEvents = true;
  _module = null;
  _isPaused = false;
  _volume = 0.0;
  _lastVolume = 0.0;
  _maxVolume = 0.2;
  _speed = 100;
  _autotrack = true;
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

  command(command) {
    try {
      this.module.execute(command);
      this.dispatchEvent("command", { value: command });
    } catch (e) {
      console.log("fte command error: " + e);
    }
  }

  dispatchEvent(name, detail) {
    if (this.emitEvents) {
      fteEvent(name, detail);
    }
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
  speed() {
    return this._speed;
  }

  setSpeed(speed) {
    this._speed = parseFloat(speed);
    this.command("demo_setspeed " + this._speed);
    this.dispatchEvent("demo_setspeed", { value: this._speed });
  }

  demoJump(demoTime) {
    const newDemoTime = Math.floor(demoTime);
    const currentDemoTime = this.getDemoElapsedTime();
    const currentUserid = this.getTrackUserid();

    this.command("demo_jump " + newDemoTime);

    // restore track on backwards jump
    if (newDemoTime < currentDemoTime) {
      const restoreTrack = () => {
        if (this._autotrack) {
          this.enableAutotrack();
        } else {
          this.track(currentUserid);
        }
      };

      setTimeout(restoreTrack, 20);
    }

    this.dispatchEvent("demo_jump", { value: newDemoTime });
  }

  play() {
    this._isPaused = false;
    this.command("demo_setspeed " + this._speed);
    this.dispatchEvent("play");
  }

  isPlaying() {
    return !this.isPaused();
  }

  isPaused() {
    return this._isPaused;
  }

  pause() {
    this._isPaused = true;
    this.command("demo_setspeed 0");
    this.dispatchEvent("pause");
  }

  togglePlay() {
    this._isPaused ? this.play() : this.pause();
  }

  // track
  autotrack() {
    return this._autotrack;
  }

  enableAutotrack() {
    this.command("cl_autotrack stats");
    this._autotrack = true;
    this.dispatchEvent("autotrack", { value: this._autotrack });
  }

  disableAutotrack() {
    this.track(this.getTrackUserid());
    this.dispatchEvent("autotrack", { value: this._autotrack });
  }

  toggleAutotrack() {
    if (this.autotrack()) {
      this.disableAutotrack();
    } else {
      this.enableAutotrack();
    }
  }

  track(userid) {
    this._autotrack = false;
    this.command("cl_autotrack user");
    this.command("track " + userid);
    this.dispatchEvent("track", { value: userid });
  }

  // volume
  mute() {
    this.setVolume(0);
  }

  isMuted() {
    return 0 === this._volume;
  }

  unmute() {
    if (0 === this._lastVolume) {
      this._lastVolume = this.maxVolume() / 100;
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
    const newVolume = parseFloat(value);

    if (0 === newVolume) {
      this._lastVolume = this._volume;
    }

    this._volume = newVolume;
    this.command("volume " + this._volume);
    this.dispatchEvent("volume", { value: this._volume });
  }

  toPlayback() {
    return {
      url: "todo",
      time: this.getDemoElapsedTime(),
      autotrack: this.autotrack(),
      trackUserid: this.getTrackUserid(),
      speed: this.speed(),
    };
  }

  applyPlayback(playback) {
    this.emitEvents = false;

    const timeDelta = Math.abs(playback.time - this.getDemoElapsedTime());
    if (timeDelta > 1) {
      console.log("############# SHOULD DEMOJUMP TO", playback.time);
      this.demoJump(playback.time);
    }

    if (playback.trackUserid !== this.getTrackUserid()) {
      console.log("############# SHOULD TRACK", playback.trackUserid);
      this.track(playback.trackUserid);
    }

    if (playback.speed !== this.speed()) {
      console.log("############# SHOULD SET SPEED", playback.speed);
      this.setSpeed(playback.speed);
    }

    this.emitEvents = true;
  }
}
