import { faTerminal } from "@fortawesome/free-solid-svg-icons";
import { useFteController } from "@qwhub/pages/games/fte/hooks.ts";
import { IconButton } from "./IconButton.tsx";

export const ConsoleToggle = () => {
  const fte = useFteController();

  function handleClick() {
    fte?.toggleConsole();
  }

  if (!fte) {
    return null;
  }

  return (
    <IconButton
      onClick={handleClick}
      title={"Toggle console"}
      icon={faTerminal}
    />
  );
};
