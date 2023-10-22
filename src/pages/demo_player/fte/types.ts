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
export type FteModule = {
  files: object;
  canvas: HTMLCanvasElement;
  setStatus: (value: string) => void;

  execute: (command: string) => void;
  getDemoElapsedTime: () => number;
  getPlayerInfo: () => PlayerInfo[];
  getMapName: () => string;
  getTimelimit: () => number;
  getTrackUserid: (seatIndex: number) => number;
};
