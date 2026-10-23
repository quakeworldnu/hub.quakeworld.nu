import { faTerminal } from "@fortawesome/free-solid-svg-icons";
import { useFteController } from "@/lib/fte/hooks";
import { IconButton } from "./icon-button";

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
