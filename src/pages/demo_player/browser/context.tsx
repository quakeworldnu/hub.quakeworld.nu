import { createContext, ReactNode, useContext, useState } from "react";
import { Demo } from "../services/supabase/supabase.types.ts";

type DemoContextProps = {
  demos: Demo[];
  setDemos: (demos: Demo[] | null, count: number | null) => void;
  hasDemos: boolean;
  count: number;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const DemoContext = createContext<DemoContextProps>({
  demos: [],
  setDemos: () => {},
  hasDemos: false,
  count: 0,
  isLoading: true,
  setIsLoading: () => {},
});

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function setDemos_(demos: Demo[] | null, count: number | null) {
    setCount(count || 0);
    setDemos(demos || []);
  }

  const value = {
    demos,
    setDemos: setDemos_,
    hasDemos: demos.length > 0,
    count,
    isLoading,
    setIsLoading,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};

export const useDemos = () => useContext(DemoContext);
