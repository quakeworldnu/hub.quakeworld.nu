import {
  Armor,
  Health,
  KtxstatsV3,
  Player,
  Powerup,
  Weapon,
} from "@qwhub/pages/games/player/KtxstatsV3.ts";
import {
  groupBy,
  isObjectType,
  map,
  mergeDeep,
  pipe,
  reduce,
  sort,
  values,
} from "remeda";

export type KtxstatsV3E = KtxstatsV3 & {
  teamsStats: TeamStats[];
};

export type TeamStats = Player & {
  playerCount: number;
};

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

export function toKtxstatsV3Enhanced(json: string): KtxstatsV3E {
  const source: KtxstatsV3 = JSON.parse(json);
  const enchanced: KtxstatsV3E = {
    ...source,
    teamsStats: [],
  };

  // players
  enchanced.players = pipe(
    enchanced.players,
    map(
      (player) => mergeDeep(getPlayerDefaults(), player) as unknown as Player,
    ), // defaults
    sort((a, b) => b.stats.frags - a.stats.frags), // sort by frags
  );

  // add accumulated stats per team
  if (source.teams && source.players.length > 2) {
    enchanced.teamsStats = pipe(
      enchanced.players,
      groupBy((player) => player.team),
      values(),
      map((players): TeamStats => {
        const accumulated = reduce(
          players,
          (acc, p) => ({
            ...getPlayerDefaults(),
            ...sumObjectKeysDeep(acc, p),
          }),
          getPlayerDefaults(),
        );

        const result = {
          ...accumulated,
          name: "",
          team: players[0].team,
          "top-color": players[0]["top-color"],
          "bottom-color": players[0]["bottom-color"],
          playerCount: players.length,
        };

        if (result.playerCount > 0) {
          result.dmg["taken-to-die"] = Math.round(
            result.dmg["taken-to-die"] / players.length,
          );
        }

        return result;
      }),
    );
  }

  return enchanced;
}

function sumObjectKeysDeep(obj1: Player, obj2: Player): Partial<Player> {
  const result = {};
  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]) as Set<
    keyof Player
  >;

  for (const key of keys) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    // If both values are numbers, sum them
    if (typeof val1 === "number" && typeof val2 === "number") {
      // @ts-ignore
      result[key] = val1 + val2;
    }

    // If both values are objects, recursively sum them
    else if (isObjectType(val1) && isObjectType(val2)) {
      // @ts-ignore
      result[key] = sumObjectKeysDeep(val1, val2);
    }

    // If only one of the values exists and is an object, use it as is
    else if (isObjectType(val1)) {
      // @ts-ignore
      result[key] = { ...val1 };
    } else if (isObjectType(val2)) {
      // @ts-ignore
      result[key] = { ...val2 };
    }

    // Otherwise, set the existing value (from either obj1 or obj2) if it exists
    else if (val1 !== undefined) {
      // @ts-ignore
      result[key] = val1;
    } else if (val2 !== undefined) {
      // @ts-ignore
      result[key] = val2;
    }
  }

  return result;
}
