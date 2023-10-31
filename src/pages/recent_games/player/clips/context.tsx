import { createContext, ReactNode, useContext, useState } from "react";
import { useBoolean } from "usehooks-ts";
import { query } from "urlcat";
import { useCurrentDemoId } from "../../playlist/hooks.ts";

type ClipEditorContextProps = {
  isEnabled: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
  from: number;
  setFrom: (from: number) => void;
  to: number;
  setTo: (to: number) => void;
  range: number[];
  setRange: (range: number[]) => void;
  getUrl: () => string;
};

const ClipEditorContext = createContext<ClipEditorContextProps>({
  isEnabled: false,
  from: 0,
  setFrom: () => {},
  to: 0,
  setTo: () => {},
  enable: () => {},
  disable: () => {},
  toggle: () => {},
  getUrl: () => "",
  range: [0, 0],
  setRange: () => {},
});

export const ClipEditorProvider = ({ children }: { children: ReactNode }) => {
  const demoId = useCurrentDemoId();
  const {
    value: isEnabled,
    setTrue: enable,
    setFalse: disable,
    toggle,
  } = useBoolean(false);
  const [from, setFrom] = useState<number>(0);
  const [to, setTo] = useState<number>(0);

  function setRange([from, to]: number[]) {
    setFrom(from);
    setTo(to);
  }

  function getUrl(): string {
    const q = query({ demoId, from: from, to: to });
    return `https://qwsb-4b8ab--demoplayer-ue1ng6v5.web.app/recent_games/?${q}`;
  }

  const value = {
    isEnabled,
    enable,
    disable,
    toggle,
    from,
    setFrom,
    to,
    setTo,
    range: [from, to],
    setRange,
    getUrl,
  };

  return (
    <ClipEditorContext.Provider value={value}>
      {children}
    </ClipEditorContext.Provider>
  );
};

export const useClipEditor = () => useContext(ClipEditorContext);
