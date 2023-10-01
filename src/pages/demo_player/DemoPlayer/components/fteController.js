export function fteEvent(name, detail) {
  const event = new CustomEvent(`fte.${name}`, { detail });
  window.dispatchEvent(event);
}

export class FteController {
  _module;
  _isPaused;
  _isMuted;
  _volume;
  _speed;
  _track;
  _players;

  constructor(module) {
    this._module = module;
    this._isPaused = false;
    this._isMuted = false;
    this._volume = 0.5;
    this._speed = 100;
    this._track = "";
    this._players = [];

    if (false) {
      const eventHandlers = {
        "fte.play": () => this.play(),
        "fte.pause": () => this.pause(),
        "fte.toggle_play": () => this.togglePlay(),
        "fte.mute": () => this.mute(),
        "fte.unmute": () => this.unmute(),
        "fte.toggle_mute": () => this.toggleMute(),
        "fte.set_volume": (e) => this.setVolume(e.detail.value),
        "fte.set_speed": (e) => this.setSpeed(e.detail.value),
        "fte.demo_jump": (e) => this.demoJump(e.detail.value),
      };

      for (const [key, value] of Object.entries(eventHandlers)) {
        window.addEventListener(key, value);
      }
    }
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
  getPlayers() {
    if (this._players.length > 0) {
      return this._players;
    }

    try {
      this._players = this.module.player_info();
      return this._players;
    } catch (e) {
      return [];
    }
  }

  getGametime() {
    try {
      return this.module.gametime();
    } catch (e) {
      return 0;
    }
  }

  getTrackUserid() {
    try {
      const seatIndex = 0; // index of screen in splitscreen
      return this.module.track_userid(seatIndex);
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
    fteEvent("speed", { value: this._speed });
  }

  demoJump(gametime) {
    const gametime_ = Math.floor(gametime);
    this.command("demo_jump " + gametime_);
    fteEvent("demo_jump", { value: gametime_ });
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
    this.track("");
  }

  track(name = "") {
    if (name === "") {
      this.command("autotrack 1");
    } else {
      this.command("autotrack 0");
      this.command("track " + name);
    }
    this._track = name;
    fteEvent("track", { value: name });
  }

  getTrack() {
    return this._track;
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
    fteEvent("volume", { value: this._volume });

    if (value > 0) {
      this.unmute();
    }
  }
}
