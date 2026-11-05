import type { TwitchStream } from "./types";

// featured twitch streamers: twitch login => in-game name
export const streamers: Record<string, string> = {
  "4ksae": "sae",
  amd_glad: "glad",
  ake_vader: "Ake Vader",
  annihilazor: "anni",
  badsebitv: "badsebitv1",
  blaze__qw: "blaze",
  banceqw: "Bance",
  bogojoker: "bogojoker",
  bps__: "bps",
  chadmcdouche: "velocity",
  devqw: "dev",
  dracs_gaming: "dracs",
  hemostick: "hemostx",
  hangtime_of_qw: "HangTime",
  hiipe_qw: "hiipe",
  kliceo: "klice",
  locktar: "LocKtar",
  lordlame: "lordlame",
  lolekd2: "lolekd2",
  maalox1: "BLooD_DoG(D_P)",
  maxpowerqw: "MAX POWER",
  mille_qw: "Mille",
  miltonizer: "Milton",
  namtsui: "namtsui",
  niwsen: "niw",
  novate: "Flea",
  ocoini: "ocoini",
  qhlan: "QHLAN.CAM",
  pierunski: "Thunder",
  proudsausage: "eb",
  quakeworld: "[streambot]",
  quakeworlddemos: "[demobot]",
  qwhammer: "hmr",
  qwrocket: "raket",
  peppe_qw: "peppe",
  mrphren: "phrenic",
  reppie: "reppie",
  ronm8: "kf",
  scorp_qw: "sCorp",
  shining_ctf: "Shining",
  suddendeathtv: "andeh",
  tastyspleentv: "QHLAN.CAM",
  thisisdracs: "thisisdracs",
  tibaz: "tiba",
  vansinneqw: "raket",
  vikpe: "XantoM",
  wimpeeh: "Wimp",
  xerialqw: "Xerial",
  zorakwar: "Zorak",
};

export const isFeaturedStream = (stream: TwitchStream): boolean =>
  stream.user_login in streamers;

// keeps the existing order within each group
export const featuredFirst = (streams: TwitchStream[]): TwitchStream[] => [
  ...streams.filter(isFeaturedStream),
  ...streams.filter((s) => !isFeaturedStream(s)),
];

// in-game name of the streamer
export const streamClientName = (stream: TwitchStream): string =>
  streamers[stream.user_login] ?? stream.user_name;

export const streamUrl = (stream: TwitchStream): string =>
  `https://twitch.tv/${stream.user_login}`;

if (import.meta.vitest) {
  const { expect, test } = import.meta.vitest;
  const stream = (user_login: string, user_name = user_login) =>
    ({ user_login, user_name }) as TwitchStream;

  test("featuredFirst", () => {
    const streams = [
      stream("unknown_a"),
      stream("vikpe"),
      stream("unknown_b"),
      stream("bps__"),
    ];
    expect(featuredFirst(streams).map((s) => s.user_login)).toEqual([
      "vikpe",
      "bps__",
      "unknown_a",
      "unknown_b",
    ]);
  });

  test("streamClientName", () => {
    expect(streamClientName(stream("vikpe", "vikpe"))).toBe("XantoM");
    expect(streamClientName(stream("unknown", "Unknown"))).toBe("Unknown");
  });
}
