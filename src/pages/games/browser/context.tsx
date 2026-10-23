import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
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
  const {
    setPage,
    playerQuery,
    teams,
    gameMode,
    hostname,
    map,
    matchtag,
    maxAge,
    page,
  } = useGameSettings();
  const filters = {
    gameMode,
    hostname,
    map,
    teams,
    matchtag,
    playerQuery,
    maxAge,
  };

  // keep page from url/storage on first load, reset when filters change
  // (resolved during render so the rows query never runs with a stale page)
  const filtersKey = JSON.stringify(filters);
  const [pageFiltersKey, setPageFiltersKey] = useState(filtersKey);
  const currentPage = pageFiltersKey === filtersKey ? page : 1;

  useEffect(() => {
    if (pageFiltersKey !== filtersKey) {
      setPageFiltersKey(filtersKey);
      setPage(1);
    }
  }, [filtersKey]);

  // previous results stay visible while new ones load
  const countQuery = useQuery({
    queryKey: ["games", "count", filters],
    queryFn: ({ signal }) => searchGamesCount(filters, signal),
    placeholderData: keepPreviousData,
  });
  const rowsQuery = useQuery({
    queryKey: ["games", "rows", filters, currentPage],
    queryFn: ({ signal }) =>
      searchGamesRows({ ...filters, page: currentPage }, signal),
    placeholderData: keepPreviousData,
  });

  const games = rowsQuery.data ?? [];
  const value = {
    games,
    hasGames: games.length > 0,
    count: countQuery.data ?? 0,
    isLoading: countQuery.isFetching || rowsQuery.isFetching,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGames = () => useContext(GameContext);
