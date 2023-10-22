import { ReactNode, useEffect, useState } from "react";
import { SortableItemList } from "./Sortable.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faPlay,
  faPlus,
  faSort,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Timestamp } from "../browser/Timestamp.tsx";
import { usePlaylist } from "./hooks.ts";
import type { Demo } from "../services/supabase/supabase.types.ts";
import { Switch } from "../Switch.tsx";
import classNames from "classnames";

export type { Demo } from "../services/supabase/supabase.types.ts";

export type PlaylistItem = {
  id: number;
  demo: Demo;
};

export const Playlist = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { isEmpty, count } = usePlaylist();

  useEffect(() => {
    if (isEmpty) {
      setIsEditing(false);
    }
  }, [isEmpty]);

  return (
    <div>
      <div className="flex p-5 bg-white/5 items-center">
        <FontAwesomeIcon icon={faList} className="text-slate-400 mr-2" />
        <div>
          <span className="font-bold text-slate-200">Playlist</span>{" "}
          {!isEmpty && (
            <span className={"text-slate-400 text-sm"}>({count})</span>
          )}
        </div>

        <div className={classNames("text-sm ml-auto", { hidden: isEmpty })}>
          <Switch
            label="Edit"
            enabled={isEditing}
            onClick={() => setIsEditing(!isEditing)}
          />
        </div>
      </div>
      {isEmpty && <div className="p-4 text-slate-400">Playlist is empty..</div>}
      {!isEmpty && (
        <div>{isEditing ? <EditablePlaylist /> : <ReadOnlyPlaylist />}</div>
      )}
    </div>
  );
};

export const ReadOnlyPlaylist = () => {
  const { playlist } = usePlaylist();

  return (
    <div className="app-effect-fade-in">
      {playlist.map((item) => (
        <ReadOnlyItem key={item.id} item={item} />
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
    <div className="app-effect-fade-in">
      <div className="flex gap-2 m-2">
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
      <div className="p-2">
        <Item item={item} />
      </div>
      <div className="ml-auto">
        <RemoveButton id={item.id} />
      </div>
    </div>
  );
};

export const ReadOnlyItem = ({ item }: { item: PlaylistItem }) => {
  const isPlaying = location.href.includes(`demoId=${item.demo.id}`);

  return (
    <a
      title="Play demo"
      href={`/demo_player/?demoId=${item.demo.id}`}
      className={classNames(
        "flex items-center justify-between p-2 pr-3 hover:bg-white/10 rounded group",
        {
          "bg-sky-600/30 hover:bg-sky-600/50": isPlaying,
          "hover:bg-white/10": !isPlaying,
        },
      )}
    >
      <div
        className={classNames({
          "text-green-400": isPlaying,
        })}
      >
        <Item item={item} />
      </div>
      <FontAwesomeIcon
        icon={faPlay}
        className={classNames("ml-2", {
          "text-green-400": isPlaying,
          "opacity-0 group-hover:opacity-100 group-hover:text-slate-300":
            !isPlaying,
        })}
      />
    </a>
  );
};

export const Item = ({ item }: { item: PlaylistItem }) => {
  return (
    <div className="text-sm">
      <div className="font-bold mb-0.5">{item.demo.title}</div>
      <div className="text-slate-400 text-xs">
        {item.demo.mode} on {item.demo.map} {"-"}{" "}
        <Timestamp timestamp={item.demo.timestamp} />
      </div>
    </div>
  );
};
