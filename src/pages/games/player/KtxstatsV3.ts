export function toKtxstatsV3(json: string): KtxstatsV3 {
  return JSON.parse(json);
}

export interface KtxstatsV3 {
  version: number;
  date: string;
  map: string;
  hostname: string;
  ip: string;
  port: number;
  mode: string;
  tl: number;
  dm: number;
  duration: number;
  demo: string;
  players: Player[];
}

export interface Player {
  top_color: number;
  bottom_color: number;
  ping: number;
  login: string;
  name: string;
  team: string;
  stats: PlayerStats;
  dmg: PlayerDamage;
  xfer_rl: number;
  xfer_lg: number;
  spree: {
    max: number;
    quad: number;
  };
  control: number;
  speed: {
    avg: number;
    max: number;
  };
  weapons: Weapons;
  items: Items;
}

export interface PlayerDamage {
  taken: number;
  given: number;
  team: number;
  self: number;
  "team-weapons": number;
  "enemy-weapons": number;
  "taken-to-die": number;
}

export interface Items {
  health_15?: Health;
  health_25?: Health;
  health_100?: Health;
  ya?: Armor;
  ra?: Armor;
  ga?: Armor;
}

export interface Armor {
  took: number;
  time: number;
}

export interface Health {
  took: number;
}

export interface PlayerStats {
  frags: number;
  deaths: number;
  tk: number;
  "spawn-frags": number;
  kills: number;
  suicides: number;
}

export interface Weapons {
  sg?: Weapon;
  ng?: Weapon;
  ssg?: Weapon;
  sng?: Weapon;
  gl?: Weapon;
  rl?: Weapon;
  lg?: Weapon;
}

export interface Weapon {
  acc: {
    attacks: number;
    hits: number;
  };
  kills: WeaponKills;
  deaths: number;
  pickups: WeaponPickups;
  damage: {
    enemy: number;
    team: number;
  };
}

export interface WeaponKills {
  total: number;
  team: number;
  enemy: number;
  self: number;
}

export interface WeaponPickups {
  dropped?: number;
  taken: number;
  "total-taken": number;
  "spawn-taken": number;
  "spawn-total-taken": number;
}
