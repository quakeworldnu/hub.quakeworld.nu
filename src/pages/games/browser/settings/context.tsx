import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import {
  type DisplayMode,
  type GameBrowserSettings,
  type GameMode,
  gameModes,
} from "./types.ts";

type GameBrowserSettingsProps = {
  displayMode: DisplayMode;
  setDisplayMode: (displayMode: DisplayMode) => void;
  gameMode: GameMode;
  setGameMode: (gameMode: GameMode) => void;
  hostname: string;
  setHostname: (query: string) => void;
  map: string;
  setMap: (query: string) => void;
  playerQuery: string;
  setPlayerQuery: (query: string) => void;
  teams: string;
  setTeams: (query: string) => void;
  matchtag: string;
  setMatchtag: (query: string) => void;
  maxAge: number;
  setMaxAge: (maxAge: number) => void;
  page: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
};

const defaultSettings: GameBrowserSettings = {
  displayMode: "Grid",
  gameMode: "All",
  hostname: "",
  map: "",
  playerQuery: "",
  teams: "",
  matchtag: "",
  maxAge: 30,
  page: 1,
};

const queryKeys: (keyof GameBrowserSettings)[] = [
  "gameMode",
  "hostname",
  "map",
  "playerQuery",
  "teams",
  "matchtag",
  "maxAge",
  "page",
];

// if any filter is in the query string, the query string is the full state
function settingsFromQuery(): Partial<GameBrowserSettings> {
  const params = new URLSearchParams(window.location.search);

  if (!queryKeys.some((key) => params.has(key))) {
    return {};
  }

  const value = (key: keyof GameBrowserSettings) =>
    params.get(key) ?? String(defaultSettings[key]);
  const num = (key: keyof GameBrowserSettings) => {
    const n = Number.parseInt(value(key));
    return Number.isNaN(n) ? (defaultSettings[key] as number) : n;
  };
  const gameMode = value("gameMode") as GameMode;

  return {
    gameMode: gameModes.includes(gameMode)
      ? gameMode
      : defaultSettings.gameMode,
    hostname: value("hostname"),
    map: value("map"),
    playerQuery: value("playerQuery"),
    teams: value("teams"),
    matchtag: value("matchtag"),
    maxAge: num("maxAge"),
    page: num("page"),
  };
}

// only non-default values are written, other params (e.g. gameId) are kept
function settingsToQuery(settings: GameBrowserSettings) {
  const params = new URLSearchParams(window.location.search);

  for (const key of queryKeys) {
    if (settings[key] === defaultSettings[key]) {
      params.delete(key);
    } else {
      params.set(key, String(settings[key]));
    }
  }

  const search = params.toString();
  const url = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", url);
}

const GameSettingsContext = createContext<GameBrowserSettingsProps>({
  ...defaultSettings,
  setDisplayMode: () => {},
  setGameMode: () => {},
  setHostname: () => {},
  setMap: () => {},
  setPlayerQuery: () => {},
  setTeams: () => {},
  setMatchtag: () => {},
  setMaxAge: () => {},
  setPage: () => {},
  nextPage: () => {},
  prevPage: () => {},
});

export const GameSettingsProvider = ({
  children,
  localStorageKey,
}: {
  children: ReactNode;
  localStorageKey: string;
}) => {
  const [storedSettings, setStoredSettings] =
    useLocalStorage<GameBrowserSettings>(localStorageKey, defaultSettings);
  // query string is the source of truth, local storage restores it between sessions
  const [initialSettings] = useState<GameBrowserSettings>(() => ({
    ...defaultSettings,
    ...storedSettings,
    ...settingsFromQuery(),
  }));
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    initialSettings.displayMode,
  );
  const [gameMode, setGameMode] = useState<GameMode>(initialSettings.gameMode);
  const [hostname, setHostname] = useState<string>(initialSettings.hostname);
  const [map, setMap] = useState<string>(initialSettings.map);
  const [playerQuery, setPlayerQuery] = useState<string>(
    initialSettings.playerQuery,
  );
  const [teams, setTeams] = useState<string>(initialSettings.teams);
  const [matchtag, setMatchtag] = useState<string>(initialSettings.matchtag);
  const [maxAge, setMaxAge] = useState<number>(initialSettings.maxAge);
  const [page, setPage] = useState<number>(initialSettings.page);

  useEffect(() => {
    const settings = {
      displayMode,
      gameMode,
      hostname,
      map,
      playerQuery,
      teams,
      matchtag,
      maxAge,
      page,
    };
    setStoredSettings(settings);
    settingsToQuery(settings);
  }, [
    displayMode,
    gameMode,
    hostname,
    map,
    playerQuery,
    teams,
    matchtag,
    maxAge,
    page,
  ]);

  function nextPage() {
    setPage(page + 1);
  }

  function prevPage() {
    setPage(page - 1);
  }

  const value = {
    displayMode,
    setDisplayMode,
    gameMode,
    setGameMode,
    hostname,
    setHostname,
    map,
    setMap,
    playerQuery,
    setPlayerQuery,
    teams,
    setTeams,
    matchtag,
    setMatchtag,
    maxAge,
    setMaxAge,
    page,
    setPage,
    nextPage,
    prevPage,
  };

  return (
    <GameSettingsContext.Provider value={value}>
      {children}
    </GameSettingsContext.Provider>
  );
};

export const useGameSettings = () => useContext(GameSettingsContext);
