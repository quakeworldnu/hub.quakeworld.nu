export type FteAssets = { [key: string]: string };

export type FtePreloadModule = {
  canvas: HTMLCanvasElement;
  files: object;
  setStatus: (value: string) => void;
};

export type FteModule = FtePreloadModule & {
  STAT_HEALTH: number;
  STAT_WEAPONMODELI: number;
  STAT_AMMO: number;
  STAT_ARMOR: number;
  STAT_WEAPONFRAME: number;
  STAT_SHELLS: number;
  STAT_NAILS: number;
  STAT_ROCKETS: number;
  STAT_CELLS: number;
  STAT_ACTIVEWEAPON: number;
  STAT_TOTALSECRETS: number;
  STAT_TOTALMONSTERS: number;
  STAT_SECRETS: number;
  STAT_MONSTERS: number;
  STAT_ITEMS: number;
  STAT_VIEWHEIGHT: number;
  STAT_TIME: number;
  STAT_MATCHSTARTTIME: number;

  W_AXE: number;
  W_SHOTGUN: number;
  W_SUPER_SHOTGUN: number;
  W_NAILGUN: number;
  W_SUPER_NAILGUN: number;
  W_GRENADE_LAUNCHER: number;
  W_ROCKET_LAUNCHER: number;
  W_LIGHTNING: number;

  IT_SHOTGUN: number;
  IT_SUPER_SHOTGUN: number;
  IT_NAILGUN: number;
  IT_SUPER_NAILGUN: number;
  IT_GRENADE_LAUNCHER: number;
  IT_ROCKET_LAUNCHER: number;
  IT_LIGHTNING: number;
  IT_SUPER_LIGHTNING: number;
  IT_SHELLS: number;
  IT_NAILS: number;
  IT_ROCKETS: number;
  IT_CELLS: number;
  IT_AXE: number;
  IT_ARMOR1: number;
  IT_ARMOR2: number;
  IT_ARMOR3: number;
  IT_SUPERHEALTH: number;
  IT_KEY1: number;
  IT_KEY2: number;
  IT_INVISIBILITY: number;
  IT_INVULNERABILITY: number;
  IT_SUIT: number;
  IT_QUAD: number;
  IT_SIGIL1: number;
  IT_SIGIL2: number;
  IT_SIGIL3: number;
  IT_SIGIL4: number;

  // execute: (command: string) => void;
  getClientState: () => ClientState;
  // getDemoElapsedTime: () => number;
  // getPlayerInfo: () => Player[];
  // getMapName: () => string;
  // getTimelimit: () => number;
  // getTrackUserid: (seatIndex: number) => number;
};

export type ClientState = {
  allocated_client_slots: number;
  deathmatch: number;
  gametime: number;
  matchgametimestart: number;
  // matchstate: number;
  teamplay: number;
  time: number;

  getPlayer: (index: number) => Player;
  getPlayerLocation: (index: number) => string;
};

export type Player = {
  userid: number;
  spectator: number;
  frags: number;
  getName: () => number[];
  getNamePlain: () => string;
  getTeam: () => number[];
  getTeamPlain: () => string;
  getWeaponStats: () => void;
  getStats: () => { [key: number]: number };
  getStatsFloat: () => { [key: number]: number };
};

export type Team = {
  name: number[];
  frags: number;
  players: Player[];
};

export enum Autotrack {
  ON = "stats",
  OFF = "user",
}

export enum ControlSource {
  USER = "user",
  GROUP = "group",
}

export type DemoPlayback = {
  demo_jump: number;
  demo_setspeed: number;
  cl_autotrack: Autotrack | string;
  track: number;
};

export interface FTEC {
  cbufadd: (command: string) => void;
}
