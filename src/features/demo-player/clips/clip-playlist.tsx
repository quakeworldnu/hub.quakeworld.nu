import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useBoolean } from "usehooks-ts";
import type { FteController } from "@/lib/fte/fte-controller";
import { useFteController } from "@/lib/fte/hooks";
import { type Clip, parseUrlClips } from "@/utils/game-url";

export const CLIP_CHANGE_EVENT = "hub.clips.change";

type ClipPlaylistContextProps = {
  clips: Clip[];
  activeIndex: number;
  active: Clip | null;
  goTo: (index: number) => void;
  playClip: (index: number) => void;
  isJumping: (elapsedTime: number) => boolean;
  autoplay: boolean;
  toggleAutoplay: () => void;
};

const ClipPlaylistContext = createContext<ClipPlaylistContextProps>({
  clips: [],
  activeIndex: 0,
  active: null,
  goTo: () => {},
  playClip: () => {},
  isJumping: () => false,
  autoplay: true,
  toggleAutoplay: () => {},
});

export const ClipPlaylistProvider = ({ children }: { children: ReactNode }) => {
  const fte = useFteController();
  const [clips] = useState<Clip[]>(() => parseUrlClips(window.location.search));
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { value: autoplay, toggle: toggleAutoplay } = useBoolean(true);
  const pendingJump = useRef<{ clip: Clip; expires: number } | null>(null);

  function goTo(index: number) {
    if (index >= 0 && index < clips.length) {
      setActiveIndex(index);
    }
  }

  // make clip active and jump to its start (with its track)
  function playClip(index: number) {
    const clip = clips[index];

    if (!fte || !clip) {
      return;
    }

    goTo(index);
    pendingJump.current = { clip, expires: Date.now() + 5000 };
    jumpToClip(fte, clip);
  }

  // a rewind replays the demo from the start, ignore positions until the jump has landed
  function isJumping(elapsedTime: number): boolean {
    const pending = pendingJump.current;

    if (!pending) {
      return false;
    }

    const hasLanded =
      elapsedTime >= pending.clip.from && elapsedTime < pending.clip.to;

    if (hasLanded || Date.now() > pending.expires) {
      pendingJump.current = null;
      return false;
    }

    return true;
  }

  useEffect(() => {
    if (clips.length === 0) {
      return;
    }

    const detail = { index: activeIndex, total: clips.length };
    window.dispatchEvent(new CustomEvent(CLIP_CHANGE_EVENT, { detail }));
  }, [activeIndex]);

  const value = {
    clips,
    activeIndex,
    active: clips[activeIndex] ?? null,
    goTo,
    playClip,
    isJumping,
    autoplay,
    toggleAutoplay,
  };

  return (
    <ClipPlaylistContext.Provider value={value}>
      {children}
    </ClipPlaylistContext.Provider>
  );
};

export const useClipPlaylist = () => useContext(ClipPlaylistContext);

function jumpToClip(fte: FteController, clip: Clip) {
  function applyTrack() {
    if (clip.track === "auto") {
      fte.enableAutotrack();
      return;
    }

    const userid = getTrackUserid(fte, clip.track);

    if (userid !== null) {
      fte.track(userid);
    } else {
      // unknown name: let fte resolve it
      fte.disableAutotrack();
      fte.command("track", clip.track);
    }
  }

  // set track before jumping, a rewind restores the last track when done
  applyTrack();
  fte.demoJump(clip.from);
  window.setTimeout(applyTrack, 50);
}

// userid by userid or player name (case insensitive)
function getTrackUserid(
  fte: FteController,
  track: number | string,
): number | null {
  if (typeof track === "number") {
    return track;
  }

  const name = track.toLowerCase();
  const player = fte
    .getPlayers()
    .find((p) => p.getNamePlain().toLowerCase() === name);

  return player ? player.userid : null;
}
