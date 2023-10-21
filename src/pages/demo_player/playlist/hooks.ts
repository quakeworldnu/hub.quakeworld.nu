import { useLocalStorage } from "usehooks-ts";
import { Demo } from "../services/supabase/supabase.types.ts";
import { PlaylistItem } from "./types.ts";

function compareDemoDates(a: string | null, b: string | null) {
  return new Date(a || 0).getTime() - new Date(b || 0).getTime();
}

export function usePlaylist() {
  const [playlist, setPlaylist] = useLocalStorage<PlaylistItem[]>("queue", []);

  function add(demo: Demo) {
    if (includes(demo.id)) {
      return;
    }

    setPlaylist([...playlist, { id: demo.id, demo }]);
  }

  function includes(id: number) {
    return playlist.some((item) => item.id === id);
  }

  function sortByTimestamp() {
    setPlaylist((queue) => {
      queue.sort((a: PlaylistItem, b: PlaylistItem) => {
        return compareDemoDates(a.demo.timestamp, b.demo.timestamp);
      });
      return queue;
    });
  }

  function remove(id: number) {
    setPlaylist((queue) => queue.filter((item) => item.id !== id));
  }

  function clear() {
    setPlaylist([]);
  }

  return {
    playlist,
    isEmpty: playlist.length === 0,
    add,
    remove,
    clear,
    includes,
    setPlaylist,
    sortByTimestamp,
  };
}
