import { ReactNode, useState } from "react";
import { SortableItemList } from "./Sortable.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSort, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Timestamp } from "../browser/Timestamp.tsx";
import { usePlaylist } from "./hooks.ts";
import type { Demo } from "../services/supabase/supabase.types.ts";

export type { Demo } from "../services/supabase/supabase.types.ts";

export type PlaylistItem = {
  id: number;
  demo: Demo;
};

export const Playlist = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { playlist } = usePlaylist();

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-2 py-1 bg-slate-600 rounded mb-3"
        >
          Edit
        </button>

        <a
          href={`/demo_player/?demoId=${playlist[0].id}`}
          className="px-2 py-1 bg-slate-600 rounded mb-3"
        >
          Play
        </a>
      </div>

      {isEditing ? <EditablePlaylist /> : <ReadOnlyPlaylist />}
    </div>
  );
};

export const ReadOnlyPlaylist = () => {
  const { playlist } = usePlaylist();

  return (
    <div>
      {playlist.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
};

export const EditablePlaylist = () => {
  const { playlist, setPlaylist } = usePlaylist();

  function handleChange(items: PlaylistItem[]) {
    setPlaylist(items);
  }

  function renderItem(item: PlaylistItem): ReactNode {
    return <EditableItem item={item} />;
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <SortButton />
        <ClearButton />
      </div>
      <SortableItemList
        items={playlist}
        handleChange={handleChange}
        renderItem={renderItem}
      />
    </div>
  );
};

const miniButtonClass =
  "flex items-center bg-slate-800 hover:bg-slate-700 text-xs py-2 px-3 rounded border border-white/10";

export function SortButton() {
  const { sortByTimestamp } = usePlaylist();

  return (
    <button className={miniButtonClass} onClick={sortByTimestamp}>
      <FontAwesomeIcon icon={faSort} className="mr-2" /> Sort by timestamp
    </button>
  );
}

export function ClearButton() {
  const { clear } = usePlaylist();

  return (
    <button onClick={clear} className={miniButtonClass}>
      <FontAwesomeIcon icon={faTrashCan} className="mr-2" /> Clear
    </button>
  );
}

export function ToggleButton({ demo }: { demo: Demo }) {
  const { includes } = usePlaylist();
  return includes(demo.id) ? (
    <RemoveButton id={demo.id} />
  ) : (
    <AddButton demo={demo} />
  );
}

export function AddButton({ demo }: { demo: Demo }) {
  const { add } = usePlaylist();

  return (
    <button
      title="Add to playlist"
      onClick={() => add(demo)}
      className="text-slate-500 hover:text-slate-300 w-8 h-8 hover:scale-125 transition-transform"
    >
      <FontAwesomeIcon icon={faPlus} size={"lg"} />
    </button>
  );
}

export function RemoveButton({ id }: { id: number }) {
  const { remove } = usePlaylist();

  return (
    <button
      title="Remove from playlist"
      onClick={() => remove(id)}
      className="text-slate-500 hover:text-slate-300 w-8 h-8 hover:scale-125 transition-transform"
    >
      <FontAwesomeIcon icon={faTrashCan} />
    </button>
  );
}

export const EditableItem = ({ item }: { item: PlaylistItem }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <Item item={item} />
      <div className="ml-auto">
        <RemoveButton id={item.id} />
      </div>
    </div>
  );
};

export const Item = ({ item }: { item: PlaylistItem }) => {
  return (
    <div className="text-sm py-1.5">
      <div className="font-bold mb-0.5">{item.demo.title}</div>
      <div className="text-slate-400 text-xs">
        {item.demo.mode} on {item.demo.map} {"-"}{" "}
        <Timestamp timestamp={item.demo.timestamp} />
      </div>
    </div>
  );
};
