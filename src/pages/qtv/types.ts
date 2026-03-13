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
    team: string;
    frags: number;
    ping: number;
  }[];
  teams: {
    name: string;
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
    id: number;
    name: string;
    number: number;
    address: string;
    url: string;
    client_names: string[];
  } | null;
};
