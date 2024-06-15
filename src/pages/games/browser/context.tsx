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
import { useGameSettings } from "./settings/context.tsx";

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
  const { setPage, playerQuery, gameMode, map, page } = useGameSettings();
  const [games, setGames] = useState<Game[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    async function run() {
      setIsLoading(true);
      const count = await searchGamesCount({ gameMode, map, playerQuery });

      let games: Game[] = [];

      const settings = { gameMode, map, playerQuery, page: 1 };
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
  }, [playerQuery, gameMode, map]);

  useEffect(() => {
    if (isFirstRender) {
      return;
    }

    async function run() {
      setIsLoading(true);
      const settings = { playerQuery, gameMode, map, page };
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

export const useGames = () => useContext(GameContext);
