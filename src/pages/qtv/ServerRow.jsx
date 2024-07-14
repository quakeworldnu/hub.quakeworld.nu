import { totalSpectatorCount } from "@qwhub/servers/util.js";

export function ServerRow({ server }) {
  function handleClick(address) {
    console.log("switch server to: ", address);
  }

  return (
    <div
      className="p-3 flex flex-col cursor-pointer border-b border-b-white/20 hover:bg-[#334] transition-colors"
      onClick={() => handleClick(server.address)}
    >
      <div className="flex justify-between items-center">
        <div className="text-sm">{server.title}</div>
        <div className="flex text-xs w-12 items-center justify-end">
          <div className="inline-block h-1.5 w-1.5 rounded-full bg-red-600 mr-1" />
          {totalSpectatorCount(server)}
        </div>
      </div>
      <div className="text-xs mt-0.5 text-slate-400">
        {server.geo.cc && (
          <img
            src={`https://www.quakeworld.nu/images/flags/${server.geo.cc.toLowerCase()}.gif`}
            width="16"
            height="11"
            className="inline mr-1 mb-[1px]"
          />
        )}{" "}
        {server.settings.hostname}
        {"ffa" === server.mode && (
          <span>
            - {server.player_slots.used}/{server.player_slots.total} players
          </span>
        )}{" "}
        - {server.status.description}
      </div>
    </div>
  );
}