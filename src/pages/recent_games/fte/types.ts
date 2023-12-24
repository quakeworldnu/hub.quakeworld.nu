export type FtePreloadModule = {
  canvas: HTMLCanvasElement;
  files: object;
  setStatus: (value: string) => void;
};

export type FteModule = FtePreloadModule & {
  // execute: (command: string) => void;
  getDemoElapsedTime: () => number;
  getPlayerInfo: () => PlayerInfo[];
  // getMapName: () => string;
  getTimelimit: () => number;
  getTrackUserid: (seatIndex: number) => number;
};

export type PlayerInfo = {
  id: number;
  name: string;
  team: string;
  health: number;
  armor: number;
  armor_type: string;

  position: {
    x: number;
    y: number;
    z: number;
  };

  // items
  items: {
    ssg: boolean;
    ng: boolean;
    sng: boolean;
    gl: boolean;
    rl: boolean;
    lg: boolean;
    quad: boolean;
    ring: boolean;
    pent: boolean;
  };
};

export enum Autotrack {
  ON = "stats",
  OFF = "user",
}

export enum ControlSource {
  USER = "user",
  GROUP = "group",
}

export type DemoPlayback = {
  demo_jump: number;
  demo_setspeed: number;
  cl_autotrack: Autotrack | string;
  cl_splitscreen: number;
  track: number;
};

export interface FTEC {
  cbufadd: (command: string) => void;
}
