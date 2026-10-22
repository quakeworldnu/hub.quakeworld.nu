import { Switch } from "../../ui/Switch.tsx";
import { useClipPlaylist } from "../clips/playlist.tsx";

// autoplay next clip, only relevant for multiple clips (?clip=...)
export const AutoplayToggle = () => {
  const { clips, autoplay, toggleAutoplay } = useClipPlaylist();

  if (clips.length < 2) {
    return null;
  }

  return (
    <Switch
      label="Autoplay next clip"
      enabled={autoplay}
      onClick={toggleAutoplay}
    />
  );
};
