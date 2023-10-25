import { createContext, ReactNode, useContext, useState } from "react";
import { Demo } from "../services/supabase/supabase.types.ts";

type DemoContextProps = {
  demos: Demo[];
  setDemos: (demos: Demo[] | null) => void;
  hasDemos: boolean;
  count: number;
  setCount: (count: number | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const DemoContext = createContext<DemoContextProps>({
  demos: [],
  setDemos: () => {},
  hasDemos: false,
  count: 0,
  setCount: () => {},
  isLoading: true,
  setIsLoading: () => {},
});

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const value = {
    demos,
    setDemos: (demos: Demo[] | null) => setDemos(demos || []),
    hasDemos: demos.length > 0,
    count,
    setCount: (count: number | null) => setCount(count || 0),
    isLoading,
    setIsLoading,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};

export const useDemos = () => useContext(DemoContext);
