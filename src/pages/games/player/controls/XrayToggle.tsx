import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useFteController } from "../../fte/hooks.ts";
import { Switch } from "../../ui/Switch.tsx";

export const XrayToggle = () => {
  const fte = useFteController();
  const [xray, setXray] = useLocalStorage<number>("fte.config.pip_xray", 0);

  function handleClick() {
    setXray(xray ? 0 : 1);
  }

  useEffect(() => {
    fte?.command("pip_xray", xray);
  }, [xray]);

  if (!fte) {
    return null;
  }

  return (
    <span title="X-ray: Show players through walls">
      <Switch label="X-ray" enabled={xray > 0} onClick={handleClick} />
    </span>
  );
};
