import { getMapshotCssUrl } from "@qwhub/services/mapshots";

export function Mapshot({ map, children }) {
  return (
    <div className="h-full bg-cover bg-center bg-[url(https://a.quake.world/mapshots/default.jpg)]">
      <div
        className="h-full bg-cover bg-center"
        style={{
          backgroundImage: getMapshotCssUrl(map),
        }}
      >
        <div className="h-full bg-gray-700/20">{children}</div>
      </div>
    </div>
  );
}
