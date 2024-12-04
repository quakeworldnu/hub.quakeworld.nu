import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import type { DisplayMode, GameBrowserSettings, GameMode } from "./types.ts";

type GameBrowserSettingsProps = {
  displayMode: DisplayMode;
  setDisplayMode: (displayMode: DisplayMode) => void;
  gameMode: GameMode;
  setGameMode: (gameMode: GameMode) => void;
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
  map: "",
  playerQuery: "",
  teams: "",
  matchtag: "",
  maxAge: 30,
  page: 1,
};

const GameSettingsContext = createContext<GameBrowserSettingsProps>({
  ...defaultSettings,
  setDisplayMode: () => {},
  setGameMode: () => {},
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
  const [settings, setSettings] = useLocalStorage<GameBrowserSettings>(
    localStorageKey,
    defaultSettings,
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    settings.displayMode,
  );
  const [gameMode, setGameMode] = useState<GameMode>(settings.gameMode);
  const [map, setMap] = useState<string>(settings.map);
  const [playerQuery, setPlayerQuery] = useState<string>(settings.playerQuery);
  const [teams, setTeams] = useState<string>(settings.teams);
  const [matchtag, setMatchtag] = useState<string>(settings.matchtag ?? "");
  const [maxAge, setMaxAge] = useState<number>(
    settings.maxAge ?? defaultSettings.maxAge,
  );
  const [page, setPage] = useState<number>(settings.page);

  useEffect(() => {
    setSettings({
      displayMode,
      gameMode,
      map,
      playerQuery,
      teams,
      matchtag,
      maxAge,
      page,
    });
  }, [displayMode, gameMode, map, playerQuery, teams, matchtag, maxAge, page]);

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
