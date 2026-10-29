import type { FteController } from "./fte-controller";
import type { FteModule } from "./types";

// every setting is a cvar, values are read from the engine when the settings panel opens
export type NumericalSettings = {
  cl_item_timers: number;
  r_drawflat: number;
  r_dynamic: number;
  contrast: number;
  gamma: number;
  crosshairsize: number;
  fov: number;
  powcam_enabled: number;
  xray: number;
  sensitivity: number;
  m_pitch: number;
  qtv_buffertime: number;
};

export type Settings = NumericalSettings & {
  gl_font: string;
  crosshaircolor: string;
  crosshairimage: string;
  enemyskin: string;
  teamskin: string;
  name: string;
};

export type ToggleSetting =
  | "cl_item_timers"
  | "powcam_enabled"
  | "xray"
  | "r_drawflat"
  | "r_dynamic";

export const defaultSettings: Settings = {
  cl_item_timers: 1,
  r_drawflat: 0,
  r_dynamic: 1,
  contrast: 1.1,
  gamma: 0.9,
  gl_font: "",
  crosshaircolor: "0 255 0",
  crosshairimage: "crosshair",
  crosshairsize: 8,
  enemyskin: "",
  teamskin: "",
  name: "",
  fov: 120,
  powcam_enabled: 1,
  xray: 1,
  sensitivity: 5,
  m_pitch: 0.022,
  qtv_buffertime: 1,
};

// registered by csaddon.dat, empty until it has loaded
const addonKeys: (keyof Settings)[] = ["xray", "powcam_enabled"];

export function readSettings(module: FteModule): Settings {
  const settings: Record<string, string | number> = { ...defaultSettings };

  for (const [key, defaultValue] of Object.entries(defaultSettings)) {
    const value = module.getCvar(key);

    if (value === "" && addonKeys.includes(key as keyof Settings)) {
      continue;
    }

    if (typeof defaultValue === "number") {
      const num = Number.parseFloat(value);
      settings[key] = Number.isNaN(num) ? defaultValue : num;
    } else {
      settings[key] = value;
    }
  }

  return settings as Settings;
}

// settings are sent as `seta <cvar> <value>` (creates addon cvars that don't exist yet),
// throttled (leading + trailing)
const COMMAND_INTERVAL_MS = 100;
const settingQueue = new Map<string, string | number>();
let flushTimeout: ReturnType<typeof setTimeout> | null = null;
let lastFlush = 0;

export function enqueueSetting<K extends keyof Settings>(
  fte: FteController,
  key: K,
  value: Settings[K],
) {
  settingQueue.set(key, value);

  if (flushTimeout) {
    return;
  }

  const wait = Math.max(0, lastFlush + COMMAND_INTERVAL_MS - Date.now());
  flushTimeout = setTimeout(() => {
    flushTimeout = null;
    lastFlush = Date.now();

    for (const [setting, value] of settingQueue) {
      fte.command("seta", `${setting} ${toCvarValue(value)}`);
    }

    settingQueue.clear();
  }, wait);
}

// persistence: only settings the user changed, so other hub config defaults still apply.
// fte reads files from localStorage, the hub config runs `exec hub_settings.cfg`
const STORED_SETTINGS_KEY = "fte.settings";
const SETTINGS_CONFIG_FILE = "id1/hub_settings.cfg";

export function storeSetting<K extends keyof Settings>(
  key: K,
  value: Settings[K],
) {
  try {
    const stored = { ...getStoredSettings(), [key]: value };
    localStorage.setItem(STORED_SETTINGS_KEY, JSON.stringify(stored));
    localStorage.setItem(
      SETTINGS_CONFIG_FILE,
      toFteFile(settingsToConfig(stored)),
    );
  } catch {
    // storage unavailable or full
  }
}

function getStoredSettings(): Partial<Settings> {
  try {
    return JSON.parse(localStorage.getItem(STORED_SETTINGS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function settingsToConfig(settings: Partial<Settings>): string {
  return Object.entries(settings)
    .map(([key, value]) => `seta ${key} ${toCvarValue(value)}\n`)
    .join("");
}

// fte stores files as one char per byte
function toFteFile(text: string): string {
  return Array.from(new TextEncoder().encode(text), (b) =>
    String.fromCharCode(b),
  ).join("");
}

function toCvarValue(value: string | number): string | number {
  return typeof value === "string" ? `"${value.replaceAll('"', "")}"` : value;
}

export function hexToRgb(hex: string): number[] {
  let hex_ = hex.replace(/^#/, "");

  // expand shorthand hex (#abc → #aabbcc)
  if (hex_.length === 3) {
    hex_ = hex_
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const num = Number.parseInt(hex_, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function rgbStringToHex(rgb: string): string {
  const [r, g, b] = rgb.split(" ").map(Number);
  return `#${[r, g, b].map((x) => (x || 0).toString(16).padStart(2, "0")).join("")}`;
}

// settings panel visibility
declare global {
  interface WindowEventMap {
    [FteSettingsEvent.Toggle]: Event;
    [FteSettingsEvent.Hide]: Event;
  }
}

export enum FteSettingsEvent {
  Toggle = "hub.fte.settings.toggle",
  Hide = "hub.fte.settings.hide",
}

export function toggleFteSettings() {
  window.dispatchEvent(new Event(FteSettingsEvent.Toggle));
}

export function hideFteSettings() {
  window.dispatchEvent(new Event(FteSettingsEvent.Hide));
}

if (import.meta.vitest) {
  const { describe, expect, test, vi } = import.meta.vitest;

  describe("readSettings", () => {
    test("reads cvars, keeps defaults for unloaded addon cvars", () => {
      const cvars: Record<string, string> = {
        fov: "110",
        gl_font: "povo5f_xtm",
        crosshaircolor: "255 0 0",
        sensitivity: "",
      };
      const module = {
        getCvar: (name: string) => cvars[name] ?? "",
      } as unknown as FteModule;
      const settings = readSettings(module);

      expect(settings.fov).toBe(110);
      expect(settings.gl_font).toBe("povo5f_xtm");
      expect(settings.crosshaircolor).toBe("255 0 0");
      expect(settings.teamskin).toBe("");
      expect(settings.sensitivity).toBe(defaultSettings.sensitivity);
      expect(settings.xray).toBe(1);
    });
  });

  describe("enqueueSetting", () => {
    test("throttles, sends latest value per setting, quotes strings", () => {
      vi.useFakeTimers();
      const command = vi.fn();
      const fte = { command } as unknown as FteController;

      enqueueSetting(fte, "fov", 100);
      enqueueSetting(fte, "fov", 110);
      enqueueSetting(fte, "gl_font", "");
      enqueueSetting(fte, "name", 'my "name"');
      vi.runAllTimers();

      expect(command.mock.calls).toEqual([
        ["seta", "fov 110"],
        ["seta", 'gl_font ""'],
        ["seta", 'name "my name"'],
      ]);
      vi.useRealTimers();
    });
  });

  describe("settingsToConfig", () => {
    test("one seta per setting, strings quoted", () => {
      expect(settingsToConfig({})).toBe("");
      expect(
        settingsToConfig({ fov: 100, teamskin: "red", name: 'a "b"' }),
      ).toBe('seta fov 100\nseta teamskin "red"\nseta name "a b"\n');
    });
  });

  describe("color conversion", () => {
    test("hexToRgb", () => {
      expect(hexToRgb("#00ff00")).toEqual([0, 255, 0]);
      expect(hexToRgb("#abc")).toEqual([170, 187, 204]);
    });

    test("rgbStringToHex", () => {
      expect(rgbStringToHex("0 255 0")).toBe("#00ff00");
      expect(rgbStringToHex("255 128 1")).toBe("#ff8001");
    });
  });
}
