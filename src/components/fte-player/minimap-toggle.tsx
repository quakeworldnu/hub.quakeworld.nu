import { faMap } from "@fortawesome/free-solid-svg-icons";
import { useFteController, useFtePolledValue } from "@/lib/fte/hooks";
import { IconButton } from "./icon-button";

// minimap_mode (addon): 0=off 1=pip 2=split 3=full
const MODES = ["off", "pip", "split", "full"];

export const MinimapToggle = () => {
  const fte = useFteController();
  const mode = useFtePolledValue(
    "minimap_mode",
    () => Number.parseInt(fte?.module.getCvar("minimap_mode") ?? "", 10) || 0,
  );

  if (!fte) {
    return null;
  }

  const nextMode = (mode + 1) % MODES.length;

  return (
    <IconButton
      onClick={() => fte.command("minimap_mode", nextMode)}
      icon={faMap}
      title={`Minimap: ${MODES[mode] ?? mode} (click for ${MODES[nextMode]})`}
      isSelected={mode > 0}
    />
  );
};
