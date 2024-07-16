export type MvdsvServer = {
  address: string;
  title: string;
  mode: string;
  status: {
    name: string;
    description: string;
  };
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
