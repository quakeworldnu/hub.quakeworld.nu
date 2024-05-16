import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePlaylist } from "../../playlist/hooks.ts";
import { btnSecondary, sizeSmall } from "../../ui/theme.ts";
import { useDemos } from "../context.tsx";

export const BulkActions = () => {
  const { demos, hasDemos } = useDemos();
  const { addMany } = usePlaylist();

  function handleClick() {
    addMany(demos);
  }

  return (
    <button
      disabled={!hasDemos}
      className={`${btnSecondary} ${sizeSmall}`}
      onClick={handleClick}
    >
      <FontAwesomeIcon
        fixedWidth
        icon={faPlus}
        className="text-slate-400 mr-1 "
      />
      Add all to playlist
    </button>
  );
};
