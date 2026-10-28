import { Switch } from "@/components/ui/switch";
import { useFteController, useFtePolledValue } from "@/lib/fte/hooks";

export const AutotrackToggle = () => {
  const fte = useFteController();
  const isEnabled = useFtePolledValue(
    "autotrack",
    () => fte?.isUsingAutotrack() ?? false,
  );

  function handleClick() {
    fte?.toggleAutotrack();
  }

  if (!fte) {
    return null;
  }

  return <Switch label="Autotrack" enabled={isEnabled} onClick={handleClick} />;
};
