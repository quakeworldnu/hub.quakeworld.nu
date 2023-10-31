import { useLocalStorage } from "usehooks-ts";
import { Demo } from "../services/supabase/supabase.types.ts";
import { compareDemoDates } from "../services/supabase/demo.ts";
import { PlaylistItem } from "./Playlist.tsx";

function demoToPlaylistItem(demo: Demo): PlaylistItem {
  return { id: demo.id, demo };
}

export function useCurrentDemoId(): number | undefined {
  const params = new URLSearchParams(window.location.search);
  const demoId = params.get("demoId");
  return demoId ? parseInt(demoId) : undefined;
}

export function useUrlClipParams(): { from: number; to: number } {
  const params = new URLSearchParams(window.location.search);
  const from = parseInt(params.get("from") || "0");
  const to = parseInt(params.get("to") || "0");
  return { from, to };
}

export function usePlaylist() {
  const [playlist, setPlaylist] = useLocalStorage<PlaylistItem[]>("queue", []);

  function add(demo: Demo) {
    if (includes(demo.id)) {
      return;
    }

    setPlaylist([...playlist, demoToPlaylistItem(demo)]);
  }

  function addMany(demos: Demo[]) {
    const newDemos = demos.filter((demo) => !includes(demo.id));
    newDemos.sort((a, b) => compareDemoDates(a.timestamp, b.timestamp));
    setPlaylist([...playlist, ...newDemos.map(demoToPlaylistItem)]);
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
    count: playlist.length,
    isEmpty: playlist.length === 0,
    add,
    addMany,
    remove,
    clear,
    includes,
    setPlaylist,
    sortByTimestamp,
  };
}
