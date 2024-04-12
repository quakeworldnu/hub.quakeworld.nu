import { useFteController } from "../../fte/hooks.ts";
import { useUpdateInterval } from "../../hooks.ts";

export const DebugFte = () => {
  useUpdateInterval(500);
  const fte = useFteController();

  if (!fte) {
    return null;
  }

  const demoProps = {
    getDemoTotalTime: fte.getDemoTotalTime(),
    getDemoElapsedTime: fte.getDemoElapsedTime(),
    getDemoGameStartTime: fte.getGameStartTime(),

    getGameTotalTime: fte.getGameTotalTime(),
    getGameElapsedTime: fte.getGameElapsedTime(),
  };

  return (
    <div className="text-xs font-mono text-left">
      <pre>{JSON.stringify({ demoProps }, null, 2)}</pre>
    </div>
  );
};
