import type { ReactNode } from "react";
import { getMapshotCssUrl } from "@/utils/mapshots";

export function Mapshot({
  map,
  children,
}: {
  map: string;
  children?: ReactNode;
}) {
  return (
    <div className="h-full bg-cover bg-center bg-[url(https://a.quake.world/mapshots/default.jpg)]">
      <div
        className="h-full bg-cover bg-center"
        style={{
          backgroundImage: getMapshotCssUrl(map, 1280),
        }}
      >
        <div className="h-full bg-gray-700/20">{children}</div>
      </div>
    </div>
  );
}
