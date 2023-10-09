import { useFteController, useFteUpdateOnEvent } from "../hooks";
import { Switch } from "./Switch";

export const AutotrackToggle = () => {
  const fte = useFteController();
  useFteUpdateOnEvent("cl_autotrack");

  if (!fte) {
    return null;
  }

  return (
    <div className="mx-3">
      <Switch
        label="Autotrack"
        enabled={fte.isUsingAutotrack()}
        onClick={() => fte.toggleAutotrack()}
      />
    </div>
  );
};
