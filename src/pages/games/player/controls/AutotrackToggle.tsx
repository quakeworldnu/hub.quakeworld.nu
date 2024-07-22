import { useFteController, useFteUpdateOnEvent } from "../../fte/hooks.ts";
import { Switch } from "../../ui/Switch.tsx";

export const AutotrackToggle = () => {
  const fte = useFteController();
  useFteUpdateOnEvent("cl_autotrack");

  function handleClick() {
    fte?.toggleAutotrack();
  }

  if (!fte) {
    return null;
  }

  return (
    <Switch
      label="Autotrack"
      enabled={fte.isUsingAutotrack()}
      onClick={handleClick}
    />
  );
};
