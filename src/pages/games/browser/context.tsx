import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useIsFirstRender } from "usehooks-ts";
import {
  searchGamesCount,
  searchGamesRows,
} from "../services/supabase/supabase.ts";
import type { Game } from "../services/supabase/supabase.types.ts";
import { useDemoSettings } from "./settings/context.tsx";

type GameContextProps = {
  games: Game[];
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
  const { setPage, query, gameMode, page } = useDemoSettings();
  const [games, setGames] = useState<Game[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    async function run() {
      setIsLoading(true);
      const count = await searchGamesCount({ gameMode, query });

      let games: Game[] = [];

      const settings = { gameMode, query, page: 1 };
      if (count > 0) {
        const { data } = await searchGamesRows(settings);
        games = data || [];
      }

      setGames(games);
      setCount(count);
      setPage(1);
      setIsLoading(false);
    }

    run();
  }, [query, gameMode]);

  useEffect(() => {
    if (isFirstRender) {
      return;
    }

    async function run() {
      setIsLoading(true);
      const settings = { query, gameMode, page };
      const { data: games } = await searchGamesRows(settings);
      setGames(games || []);
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

export const useDemos = () => useContext(GameContext);
