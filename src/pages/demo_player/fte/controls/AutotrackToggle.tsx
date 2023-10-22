import { useFteController, useFteUpdateOnEvent } from "../hooks.ts";
import { Switch } from "../../ui/Switch";

export const AutotrackToggle = () => {
  const fte = useFteController();
  useFteUpdateOnEvent("cl_autotrack");

  function handleClick() {
    fte && fte.toggleAutotrack();
  }

  if (!fte) {
    return null;
  }

  return (
    <div className="mx-3">
      <Switch
        label="Autotrack"
        enabled={fte.isUsingAutotrack()}
        onClick={handleClick}
      />
    </div>
  );
};
