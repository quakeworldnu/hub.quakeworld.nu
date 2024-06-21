import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useIsFirstRender } from "usehooks-ts";
import {
  GameSearchEntry,
  searchGamesCount,
  searchGamesRows,
} from "../services/supabase/supabase.ts";
import { useGameSettings } from "./settings/context.tsx";

type GameContextProps = {
  games: GameSearchEntry[];
  hasGames: boolean;
  count: number;
  isLoading: boolean;
};

const GameContext = createContext<GameContextProps>({
  games: [],
  hasGames: false,
  count: 0,
  isLoading: true,
});

export const GamesProvider = ({ children }: { children: ReactNode }) => {
  const { setPage, playerQuery, teams, gameMode, map, page } =
    useGameSettings();
  const [games, setGames] = useState<GameSearchEntry[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    async function run() {
      setIsLoading(true);
      const count = await searchGamesCount({
        gameMode,
        map,
        teams,
        playerQuery,
      });
      let games: GameSearchEntry[] = [];

      if (count > 0) {
        const settings = { gameMode, map, playerQuery, teams, page: 1 };
        games = await searchGamesRows(settings);
      }

      setGames(games);
      setCount(count);
      setPage(1);
      setIsLoading(false);
    }

    run();
  }, [playerQuery, teams, gameMode, map]);

  useEffect(() => {
    if (isFirstRender) {
      return;
    }

    async function run() {
      setIsLoading(true);
      const settings = { playerQuery, teams, gameMode, map, page };
      setGames(await searchGamesRows(settings));
      setIsLoading(false);
    }

    run();
  }, [page]);

  const value = {
    games,
    hasGames: games.length > 0,
    count,
    isLoading,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGames = () => useContext(GameContext);
