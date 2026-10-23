import { Switch } from "@/components/ui/switch";
import { useClipPlaylist } from "@/features/demo-player/clips/clip-playlist";

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
