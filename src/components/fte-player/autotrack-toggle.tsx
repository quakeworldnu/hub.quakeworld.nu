import { Switch } from "@/components/ui/switch";
import { useFteController, useFteUpdateOnEvent } from "@/lib/fte/hooks";

export const AutotrackToggle = () => {
  const fte = useFteController();
  useFteUpdateOnEvent("autotrack");

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
