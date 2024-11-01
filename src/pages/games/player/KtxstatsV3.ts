import { mergeDeep } from "remeda";

export function toKtxstatsV3(json: string): KtxstatsV3 {
  const stats: KtxstatsV3 = JSON.parse(json);

  stats.players = stats.players.map((p) => {
    const dst = getPlayerDefaults();
    // @ts-ignore
    return mergeDeep(dst, p) as unknown as Player;
  });

  return stats;
}

function getPlayerDefaults(): Player {
  const health: Health = {
    took: 0,
  };
  const armor: Armor = {
    took: 0,
    time: 0,
  };
  const powerup: Powerup = {
    took: 0,
    time: 0,
  };

  const weapon: Weapon = {
    acc: {
      attacks: 0,
      hits: 0,
    },
    kills: {
      total: 0,
      team: 0,
      enemy: 0,
      self: 0,
    },
    deaths: 0,
    pickups: {
      dropped: 0,
      taken: 0,
      "total-taken": 0,
      "spawn-taken": 0,
      "spawn-total-taken": 0,
    },
    damage: {
      enemy: 0,
      team: 0,
    },
  };

  return {
    "top-color": 0,
    "bottom-color": 0,
    ping: 0,
    login: "",
    name: "",
    team: "",
    stats: {
      frags: 0,
      deaths: 0,
      tk: 0,
      "spawn-frags": 0,
      kills: 0,
      suicides: 0,
    },
    dmg: {
      taken: 0,
      given: 0,
      team: 0,
      self: 0,
      "team-weapons": 0,
      "enemy-weapons": 0,
      "taken-to-die": 0,
    },
    xfer_rl: 0,
    xfer_lg: 0,
    spree: {
      max: 0,
      quad: 0,
    },
    control: 0,
    ctf: {
      caps: 0,
      "carrier-defends": 0,
      "carrier-frags": 0,
      defends: 0,
      pickups: 0,
      points: 0,
      returns: 0,
      runes: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
      },
    },
    speed: {
      avg: 0,
      max: 0,
    },
    weapons: {
      sg: weapon,
      ng: weapon,
      ssg: weapon,
      sng: weapon,
      gl: weapon,
      rl: weapon,
      lg: weapon,
    },
    items: {
      health_15: {
        took: 0,
      },
      health_25: health,
      health_100: health,
      ya: armor,
      ra: armor,
      ga: armor,
      q: powerup,
      p: powerup,
      r: powerup,
    },
  };
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
  tp: number;
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
  health_15: Health;
  health_25: Health;
  health_100: Health;
  ya: Armor;
  ra: Armor;
  ga: Armor;
  q: Powerup;
  p: Powerup;
  r: Powerup;
}

export interface Armor {
  took: number;
  time: number;
}

export interface Powerup {
  took: number;
  time: number;
}

export interface Health {
  took: number;
}

export interface Weapons {
  sg: Weapon;
  ng: Weapon;
  ssg: Weapon;
  sng: Weapon;
  gl: Weapon;
  rl: Weapon;
  lg: Weapon;
}

export interface Weapon {
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
}
