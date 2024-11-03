export type KtxstatsV3 = {
  date: string;
  demo: string;
  dm: number;
  duration: number;
  hostname: string;
  ip: string;
  map: string;
  mode: string;
  players: Player[];
  port: number;
  teams?: string[];
  tl: number;
  tp: number;
  version: number;
};

export type Player = {
  "top-color": number;
  "bottom-color": number;
  ping: number;
  login: string;
  name: string;
  team: string;
  stats: {
    frags: number;
    deaths: number;
    tk: number;
    "spawn-frags": number;
    kills: number;
    suicides: number;
  };
  dmg: PlayerDamage;
  xfer_rl: number;
  xfer_lg: number;
  spree: {
    max: number;
    quad: number;
  };
  control: number;
  ctf: {
    caps: number;
    "carrier-defends": number;
    "carrier-frags": number;
    defends: number;
    pickups: number;
    points: number;
    returns: number;
    runes: {
      "0": number;
      "1": number;
      "2": number;
      "3": number;
    };
  };
  speed: {
    avg: number;
    max: number;
  };
  weapons: Weapons;
  items: Items;
};

export type PlayerDamage = {
  taken: number;
  given: number;
  team: number;
  self: number;
  "team-weapons": number;
  "enemy-weapons": number;
  "taken-to-die": number;
};

export type Items = {
  health_15: Health;
  health_25: Health;
  health_100: Health;
  ya: Armor;
  ra: Armor;
  ga: Armor;
  q: Powerup;
  p: Powerup;
  r: Powerup;
};

export type Armor = {
  took: number;
  time: number;
};

export type Powerup = {
  took: number;
  time: number;
};

export type Health = {
  took: number;
};

export type Weapons = {
  sg: Weapon;
  ng: Weapon;
  ssg: Weapon;
  sng: Weapon;
  gl: Weapon;
  rl: Weapon;
  lg: Weapon;
};

export type Weapon = {
  acc: {
    attacks: number;
    hits: number;
  };
  kills: {
    total: number;
    team: number;
    enemy: number;
    self: number;
  };
  deaths: number;
  pickups: {
    dropped: number;
    taken: number;
    "total-taken": number;
    "spawn-taken": number;
    "spawn-total-taken": number;
  };
  damage: {
    enemy: number;
    team: number;
  };
};
