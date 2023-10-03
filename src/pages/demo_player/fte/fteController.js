import { secondsToMinutesAndSeconds } from "@qwhub/pages/demo_player/util";

export function fteEvent(name, detail) {
  const event = new CustomEvent(`fte.${name}`, { detail });
  window.dispatchEvent(event);
}

export class FteController {
  _module = null;
  _isPaused = false;
  _isMuted = false;
  _volume = 0.0;
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

    return this;
  }

  get module() {
    return this._module;
  }

  command(command) {
    try {
      this.module.execute(command);
      fteEvent("command", { value: command });
    } catch (e) {
      console.log("fte command error: " + e);
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
    fteEvent("demo_setspeed", { value: this._speed });
  }

  demoJump(demoTime) {
    const newDemoTime = Math.floor(demoTime);

    console.log(
      `############################ demoJump: ${demoTime}`,
      secondsToMinutesAndSeconds(demoTime),
      newDemoTime,
    );
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

    fteEvent("demo_jump", { value: newDemoTime });
  }

  play() {
    this._isPaused = false;
    this.command("demo_setspeed " + this._speed);
    fteEvent("play");
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
    fteEvent("pause");
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
    fteEvent("autotrack", { value: this._autotrack });
  }

  disableAutotrack() {
    this.track(this.getTrackUserid());
    fteEvent("autotrack", { value: this._autotrack });
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
    fteEvent("track", { value: userid });
  }

  // volume
  mute() {
    this._isMuted = true;
    this.command("volume 0");
    fteEvent("mute");
  }

  isMuted() {
    return this._isMuted;
  }

  unmute() {
    this._isMuted = false;
    this.command("volume " + this._volume);
    fteEvent("unmute");
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

  setVolume(value) {
    this._volume = parseFloat(value);
    this.command("volume " + this._volume);
    fteEvent("volume", { value: this._volume });
  }
}
