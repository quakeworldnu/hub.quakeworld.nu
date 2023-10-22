import { useLocalStorage } from "usehooks-ts";
import { Demo } from "../services/supabase/supabase.types.ts";
import { PlaylistItem } from "./types.ts";

function compareDemoDates(a: string | null, b: string | null) {
  return new Date(a || 0).getTime() - new Date(b || 0).getTime();
}

function demoToPlaylistItem(demo: Demo): PlaylistItem {
  return { id: demo.id, demo };
}

export function useCurrentDemoId(): number | undefined {
  const urlParams = new URLSearchParams(window.location.search);
  const demoId = urlParams.get("demoId");
  return demoId ? parseInt(demoId) : undefined;
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
