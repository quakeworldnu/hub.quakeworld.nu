import { formatDuration } from "@/utils/time";

export function GameDuration({
  elapsed,
  total,
}: {
  elapsed: number;
  total: number;
}) {
  return (
    <div className="flex font-mono items-center px-2 whitespace-nowrap">
      {formatDuration(elapsed, total)}
    </div>
  );
}
