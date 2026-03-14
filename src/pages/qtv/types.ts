export type MvdsvServer = {
  address: string;
  title: string;
  mode: string;
  status: {
    name: string;
    description: string;
  };
  players: {
    name: string;
    name_color: string;
    team: string;
    team_color: string;
    frags: number;
    ping: number;
  }[];
  teams: {
    name: string;
    name_color: string;
    frags: number;
    ping: number;
  }[];
  player_slots: {
    free: number;
    total: number;
    used: number;
  };
  spectator_slots: {
    free: number;
    total: number;
    used: number;
  };
  spectator_names: string[];
  settings: {
    map: string;
  };
  qtv_stream: {
    url: string;
    spectator_names: string[];
    spectator_count: number;
  };
  geo: {
    cc: string;
  };
};
