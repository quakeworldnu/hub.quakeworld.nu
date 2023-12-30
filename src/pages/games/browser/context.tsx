import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Demo } from "../services/supabase/supabase.types.ts";
import {
  searchDemosCount,
  searchDemosRows,
} from "../services/supabase/supabase.ts";
import { useDemoSettings } from "./settings/context.tsx";
import { useIsFirstRender } from "usehooks-ts";

type DemoContextProps = {
  demos: Demo[];
  hasDemos: boolean;
  count: number;
  isLoading: boolean;
};

const DemoContext = createContext<DemoContextProps>({
  demos: [],
  hasDemos: false,
  count: 0,
  isLoading: true,
});

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const { setPage, query, gameMode, page } = useDemoSettings();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    async function run() {
      setIsLoading(true);
      const count = await searchDemosCount({ gameMode, query });

      let demos: Demo[] = [];

      const settings = { gameMode, query, page: 1 };
      if (count > 0) {
        const { data } = await searchDemosRows(settings);
        demos = data || [];
      }

      setDemos(demos);
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
      const { data: demos } = await searchDemosRows(settings);
      setDemos(demos || []);
      setIsLoading(false);
    }

    run();
  }, [page]);

  const value = {
    demos,
    hasDemos: demos.length > 0,
    count,
    isLoading,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};

export const useDemos = () => useContext(DemoContext);
