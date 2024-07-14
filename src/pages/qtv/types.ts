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
  geo: {
    cc: string;
  };
  qtv_stream: {
    url: string;
    spectator_names: string[];
  };
};
