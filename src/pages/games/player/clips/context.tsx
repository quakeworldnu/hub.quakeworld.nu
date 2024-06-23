import { type ReactNode, createContext, useContext, useState } from "react";
import { query } from "urlcat";
import { useBoolean } from "usehooks-ts";

import { useCurrentGameId } from "../../hooks.ts";

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
  track: number | "auto" | "";
  setTrack: (track: number | "auto" | "") => void;
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
  range: [0, 0],
  setRange: () => {},
  track: 0,
  setTrack: () => {},
  getUrl: () => "",
});

export const ClipEditorProvider = ({ children }: { children: ReactNode }) => {
  const gameId = useCurrentGameId();
  const {
    value: isEnabled,
    setTrue: enable,
    setFalse: disable,
    toggle,
  } = useBoolean(false);
  const [from, setFrom] = useState<number>(0);
  const [to, setTo] = useState<number>(0);
  const [track, setTrack] = useState<number | "auto" | "">(0);

  function setRange([from, to]: number[]) {
    setFrom(Math.floor(from));
    setTo(Math.floor(to));
  }

  function getUrl(): string {
    const q = query({ gameId, from, to, track });
    const base = window.location.href.split("?")[0];
    return `${base}?${q}`;
  }

  const value = {
    isEnabled,
    enable,
    disable,
    toggle,
    from,
    setFrom: (from: number) => setFrom(Math.max(0, from)),
    to,
    setTo,
    range: [from, to],
    setRange,
    track,
    setTrack,
    getUrl,
  };

  return (
    <ClipEditorContext.Provider value={value}>
      {children}
    </ClipEditorContext.Provider>
  );
};

export const useClipEditor = () => useContext(ClipEditorContext);
