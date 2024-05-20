import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import type { DemoBrowserSettings, DisplayMode, GameMode } from "./types.ts";

type DemoBrowserSettingsProps = {
  displayMode: DisplayMode;
  setDisplayMode: (displayMode: DisplayMode) => void;
  gameMode: GameMode;
  setGameMode: (gameMode: GameMode) => void;
  query: string;
  setQuery: (query: string) => void;
  page: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
};

const defaultSettings: DemoBrowserSettings = {
  displayMode: "Grid",
  gameMode: "All",
  query: "",
  page: 1,
};

const DemoSettingsContext = createContext<DemoBrowserSettingsProps>({
  ...defaultSettings,
  setDisplayMode: () => {},
  setGameMode: () => {},
  setQuery: () => {},
  setPage: () => {},
  nextPage: () => {},
  prevPage: () => {},
});

export const DemoSettingsProvider = ({
  children,
  localStorageKey,
}: {
  children: ReactNode;
  localStorageKey: string;
}) => {
  const [settings, setSettings] = useLocalStorage<DemoBrowserSettings>(
    localStorageKey,
    defaultSettings,
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    settings.displayMode,
  );
  const [gameMode, setGameMode] = useState<GameMode>(settings.gameMode);
  const [query, setQuery] = useState<string>(settings.query);
  const [page, setPage] = useState<number>(settings.page);

  useEffect(() => {
    setSettings({ displayMode, gameMode, query, page });
  }, [displayMode, gameMode, query, page]);

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
    query,
    setQuery,
    page,
    setPage,
    nextPage,
    prevPage,
  };

  return (
    <DemoSettingsContext.Provider value={value}>
      {children}
    </DemoSettingsContext.Provider>
  );
};

export const useDemoSettings = () => useContext(DemoSettingsContext);
