// featured twitch streamers: twitch login => in-game name
export const streamers = {
  "4ksae": "sae",
  amd_glad: "glad",
  ake_vader: "ake_vader",
  annihilazor: "anni",
  badsebitv: "badsebitv1",
  bogojoker: "bogojoker",
  bps__: "bps",
  chadmcdouche: "velocity",
  devqw: "dev",
  dracs_gaming: "dracs",
  hemostick: "hemostick",
  hangtime_of_qw: "HangTime",
  hiipe_qw: "hiipe",
  kliceo: "klice",
  locktar: "LocKtar",
  lordlame: "lordlame",
  lolekd2: "lolekd2",
  maalox1: "BLooD_DoG(D_P)",
  miltonizer: "Milton",
  niwsen: "niw",
  novate: "Flea",
  ocoini: "ocoini",
  proudsausage: "eb",
  quakeworld: "[streambot]",
  quakeworlddemos: "[demobot]",
  qwhammer: "hmr",
  peppe_qw: "peppe",
  reppie: "reppie",
  ronm8: "kf",
  shining_ctf: "Shining",
  suddendeathtv: "suddendeathTV",
  vikpe: "XantoM",
  wimpeeh: "Wimp",
  zorakwar: "Zorak",
};

export const isFeaturedStream = (stream) => stream.user_login in streamers;

// in-game name of the streamer
export const streamClientName = (stream) =>
  streamers[stream.user_login] ?? stream.user_name;

export const streamUrl = (stream) => `https://twitch.tv/${stream.user_login}`;
