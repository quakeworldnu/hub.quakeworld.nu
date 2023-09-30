export class FteController {
  _module;
  _isPaused;
  _isMuted;
  _volume;
  _speed;

  constructor(module) {
    this._module = module;
    this._isPaused = false;
    this._isMuted = false;
    this._volume = 0.5;
    this._speed = 100;
  }

  get module() {
    return this._module;
  }

  getPlayers() {
    return this.module.player_info();
  }

  getGametime() {
    return this.module.gametime();
  }

  command(command) {
    try {
      this.module.execute(command);
    } catch (e) {
      console.log("fte command error: " + e);
    }
  }

  // demo playback
  speed() {
    return this._speed;
  }

  setSpeed(value) {
    this._speed = parseFloat(value);
    this.command("demo_setspeed " + this._speed);
  }

  demoJump(gametime) {
    this.command("demo_jump " + Math.floor(gametime));
  }

  play() {
    this._isPaused = false;
    this.command("demo_setspeed " + this._speed);
  }

  isPlaying() {
    return !this._isPaused;
  }

  isPaused() {
    return this._isPaused;
  }

  pause() {
    this._isPaused = true;
    this.command("demo_setspeed 0");
  }

  togglePlay() {
    this._isPaused ? this.play() : this.pause();
  }

  // volume
  mute() {
    this._isMuted = true;
    this.command("volume 0");
  }

  isMuted() {
    return this._isMuted;
  }

  unmute() {
    this._isMuted = false;
    this.command("volume " + this._volume);
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

    if (value > 0) {
      this.unmute();
    }
  }
}
