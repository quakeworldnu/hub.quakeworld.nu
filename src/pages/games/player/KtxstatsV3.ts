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
  "top-color": number;
  "bottom-color": number;
  ping: number;
  login: string;
  name: string;
  team: string;
  stats: Stats;
  dmg: Dmg;
  xfer: number;
  spree: Spree;
  control: number;
  speed: { [key: string]: number };
  weapons: Weapons;
  items: Items;
}

export interface Dmg {
  taken: number;
  given: number;
  team: number;
  self: number;
  "team-weapons": number;
  "enemy-weapons": number;
  "taken-to-die": number;
}

export interface Items {
  health_25: Ga;
  health_100: Ga;
  ya: Ga;
  ra: Ga;
  ga?: Ga;
}

export interface Ga {
  took: number;
}

export interface Spree {
  max: number;
  quad: number;
}

export interface Stats {
  frags: number;
  deaths: number;
  tk: number;
  "spawn-frags": number;
  kills: number;
  suicides: number;
}

export interface Weapons {
  axe: Axe;
  sg: Sg;
  ssg: Lg;
  gl: Gl;
  rl: Gl;
  lg: Lg;
}

export interface Axe {
  acc: AxeAcc;
  deaths: number;
  damage?: Damage;
}

export interface AxeAcc {
  attacks: number;
  hits: number;
}

export interface Damage {
  enemy: number;
  team: number;
}

export interface Gl {
  acc: GlAcc;
  kills: Kills;
  deaths: number;
  pickups: GlPickups;
  damage: Damage;
}

export interface GlAcc {
  attacks: number;
  hits: number;
  real: number;
  virtual: number;
}

export interface Kills {
  total: number;
  team: number;
  enemy: number;
  self: number;
}

export interface GlPickups {
  dropped?: number;
  taken: number;
  "total-taken": number;
  "spawn-taken": number;
  "spawn-total-taken": number;
}

export interface Lg {
  acc: AxeAcc;
  kills: Kills;
  deaths: number;
  pickups: GlPickups;
  damage: Damage;
}

export interface Sg {
  acc: AxeAcc;
  kills?: Kills;
  deaths: number;
  pickups: SgPickups;
  damage: Damage;
}

export interface SgPickups {
  dropped: number;
  "total-taken": number;
}
